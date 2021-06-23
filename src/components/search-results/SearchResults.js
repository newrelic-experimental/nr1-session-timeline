import React from 'react'
import PropTypes from 'prop-types'
import {
  NrqlQuery,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  SparklineTableRowCell,
  HeadingText,
} from 'nr1'
import { withConfigContext } from '../../context/ConfigContext'
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

class SearchResults extends React.Component {
  flattenData = data => {
    const {
      config: { groupingAttribute },
    } = this.props
    let flattened = []

    for (let d of data) {
      const name = d.metadata.name
      flattened = flattened.concat(
        d.data.map(item => {
          return { date: name, value: item[groupingAttribute] }
        })
      )
    }

    return flattened
  }

  getGoldenMetricQuery = (query, searchValue, dateValue) => {
    const {
      config: { groupingAttribute },
    } = this.props

    // convert the string to a date and then back into a string format usable by NR1
    dayjs.extend(customParseFormat)
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const dayOfStart = dayjs(dateValue, 'MMMM DD, YYYY')
      .hour(0)
      .minute(0)
      .second(0)
      .format(dateFormat)
    const dayOfEnd = dayjs(dayOfStart)
      .add(86399, 'second')
      .format(dateFormat)

    return `${query} MAX WHERE ${groupingAttribute} = '${searchValue}' and dateOf(timestamp) = '${dateValue}' SINCE '${dayOfStart}' UNTIL '${dayOfEnd}'`
  }

  onChooseSession = (evt, { item, index }) => {
    const { chooseSession } = this.props
    chooseSession(item.date, item.value)
  }

  shouldComponentUpdate(nextProps) {
    const { selected, duration } = this.props
    const nextSelected = nextProps.selected
    const nextDuration = nextProps.duration

    if (selected != nextSelected || duration != nextDuration) return true
    else return false
  }

  renderTable = data => {
    const {
      goldenMetricQueries,
      entity: { accountId },
    } = this.props

    return (
      <Table items={data}>
        <TableHeader>
          <TableHeaderCell className="search-results__table-header">
            Date
          </TableHeaderCell>
          <TableHeaderCell className="search-results__table-header">
            Session
          </TableHeaderCell>
          {goldenMetricQueries.map(q => (
            <TableHeaderCell className="search-results__table-header">
              {q.name}
            </TableHeaderCell>
          ))}
        </TableHeader>

        {({ item }) => (
          <TableRow onClick={this.onChooseSession}>
            <TableRowCell className="search-results__row">
              {item.date}
            </TableRowCell>
            <TableRowCell className="search-results__row">
              {item.value}
            </TableRowCell>
            {goldenMetricQueries.map(q => (
              <SparklineTableRowCell
                className="search-results__row"
                accountId={accountId}
                query={this.getGoldenMetricQuery(
                  q.query,
                  item.value,
                  item.date
                )}
              />
            ))}
          </TableRow>
        )}
      </Table>
    )
  }

  render() {
    const {
      entity: { accountId },
      selected,
      duration,
      config: { groupingAttribute, searchAttribute, event },
    } = this.props
    const query = `FROM ${event} SELECT uniques(${groupingAttribute}) WHERE ${searchAttribute}='${selected}' ${duration.since} FACET dateOf(timestamp) `

    return (
      <React.Fragment>
        {!selected && <div></div>}
        {selected && (
          <div className="search-results">
            <div>
              <HeadingText
                className="grid-item__header"
                type={HeadingText.TYPE.HEADING_4}
              >
                Select a Session
              </HeadingText>
            </div>
            <NrqlQuery accountId={accountId} query={query}>
              {({ data, error, loading }) => {
                if (loading) return <Spinner fillContainer />
                if (error) return <BlockText>{error.message}</BlockText>

                if (!data) return <div>No sessions found</div>
                return this.renderTable(this.flattenData(data))
              }}
            </NrqlQuery>
          </div>
        )}
      </React.Fragment>
    )
  }
}

SearchResults.propTypes = {
  entity: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
  chooseSession: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
}

export default withConfigContext(SearchResults)
