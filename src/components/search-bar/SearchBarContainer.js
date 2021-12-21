import React from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash.startcase'
import {
  TextField,
  NerdGraphQuery,
  Icon,
  HeadingText,
  Button,
  Tooltip,
} from 'nr1'
import SearchBarDrawer from './SearchBarDrawer'
import { withConfigContext } from '../../context/ConfigContext'

class SearchBarContainer extends React.Component {
  state = {
    loading: true,
    searchTerm: '',
    results: [],
    cachedResults: [],
    selectedItem: '',
  }

  componentDidMount() {
    const { savedSelectedItem } = this.props
    if (savedSelectedItem) this.setState({ selectedItem: savedSelectedItem })
  }

  loadData = async searchTerm => {
    const {
      entity,
      duration,
      config: { searchAttribute, groupingAttribute, rootEvent: event },
    } = this.props
    const nrql = `FROM ${event} SELECT uniques(${searchAttribute}) WHERE entityGuid='${entity.guid}' AND ${searchAttribute} like '%${searchTerm}%' and ${groupingAttribute} is not null ${duration.since} `

    const query = `{
      actor {
        account(id: ${entity.accountId}) {
          nrql(query: "${nrql}") {
            results
          }
        }
      }
    }`

    let queryRunning = true
    let rawData = {}
    let results = []

    while (queryRunning) {
      const { loading, data } = await NerdGraphQuery.query({ query })
      if (!loading) {
        queryRunning = false
        rawData = data
      }
    }

    if (rawData) {
      results =
        rawData.actor.account.nrql.results[0][`uniques.${searchAttribute}`]
    }

    return results
  }

  loadFromCache = async searchTerm => {
    return this.state.cachedResults.filter(result =>
      result.includes(searchTerm)
    )
  }

  handleSearchChange = async value => {
    let { loading } = this.state
    let clonedResults = [...this.state.results]
    let clonedCacheResults = [...this.state.cachedResults]

    if (value) {
      if (clonedResults && clonedCacheResults.length > 0)
        clonedResults = await this.loadFromCache(value)
      else {
        clonedResults = await this.loadData(value)
        if (clonedResults.length < 1000) clonedCacheResults = [...clonedResults]
      }
    } else {
      clonedResults = []
      clonedCacheResults = []
      loading = false
    }

    this.setState({
      results: clonedResults,
      loading: false,
      cachedResults: clonedCacheResults,
      searchTerm: value,
      selectedItem: '',
    })
  }

  onSearchInputChange = async ({ target }) => {
    const { value } = target
    this.handleSearchChange(value)
  }

  onSearchInputFocus = async ({ target }) => {
    const { value } = target
    if (value) this.handleSearchChange(value)
  }

  onSelectSearchItem = item => {
    const { selectFilter } = this.props
    selectFilter(item)
    this.setState({
      selectedItem: item,
      searchTerm: '',
      results: [],
      cachedResults: [],
    })
  }

  onRemoveSelectedItem = () => {
    const { clearFilter } = this.props
    clearFilter()
    this.setState({ selectedItem: '' })
  }

  onCloseSearchDrawer = () => {
    this.setState({
      searchTerm: '',
      results: [],
      cachedResults: [],
      selectedItem: '',
    })
  }

  render() {
    const { loading, results, searchTerm, selectedItem } = this.state
    const {
      config: { searchAttribute },
      editConfig,
    } = this.props

    return (
      <div className="search">
        <div className="search__bar">
          <HeadingText
            className="search__header"
            type={HeadingText.TYPE.HEADING_4}
          >
            Search for {startCase(searchAttribute)}:
          </HeadingText>
          {!selectedItem && (
            <TextField
              className="search__input"
              onChange={this.onSearchInputChange}
              onFocus={this.onSearchInputFocus}
              placeholder={`Start typing ...`}
              autoFocus={true}
            />
          )}
          {selectedItem && (
            <div className="search__selected">
              <div className="search__selected-item">{selectedItem}</div>
              <div
                className="search__selected-remove"
                onClick={this.onRemoveSelectedItem}
              >
                X
              </div>
            </div>
          )}
        </div>
        {!selectedItem && searchTerm && (
          <SearchBarDrawer
            loading={loading}
            results={results}
            searchTerm={searchTerm}
            select={this.onSelectSearchItem}
            closeOnClickOutside={this.onCloseSearchDrawer}
          />
        )}

        <div className="button-row">
          <Tooltip
            text="Change the app configuration"
            placementType={Tooltip.PLACEMENT_TYPE.BOTTOM}
          >
            <Button
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__CONFIGURE}
              onClick={editConfig}
            />
          </Tooltip>
        </div>
      </div>
    )
  }
}

SearchBarContainer.propTypes = {
  entity: PropTypes.object.isRequired,
  selectFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
}

export default withConfigContext(SearchBarContainer)
