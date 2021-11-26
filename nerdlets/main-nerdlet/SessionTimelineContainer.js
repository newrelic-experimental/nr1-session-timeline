import React from 'react'
import { HeadingText, Spinner, navigation } from 'nr1'
import startCase from 'lodash.startcase'
import ConfigurationContainer from '../../src/components/configuration/ConfigurationContainer'
import SearchBarContainer from '../../src/components/search-bar/SearchBarContainer'
import SearchResults from '../../src/components/search-results/SearchResults'
import Dashboard from '../../src/components/dashboard/Dashboard'
import { formatSinceAndCompare } from '../../src/utils/date-formatter'
import { withConfigContext } from '../../src/context/ConfigContext'

class SessionTimelineContainer extends React.PureComponent {
  state = {
    filter: '',
    session: '',
    sessionDate: '',
    loading: true,
    hasConfig: false,
  }

  componentDidUpdate() {
    const { loading } = this.state
    // wait for the configuration to complete loading
    if (loading) {
      const { entity, config } = this.props
      if (entity) {
        const configLoaded = config && true
        this.setState({ loading: false, hasConfig: configLoaded })
      }
    }
  }

  onSelectFilter = filter => {
    this.setState({ filter })
  }

  onClearFilter = () => {
    this.setState({ filter: '', session: '', sessionDate: '' })
  }

  onChooseSession = (sessionDate, session) => {
    const {
      timeRange,
      entity: { accountId },
    } = this.props
    const { filter } = this.state

    navigation.openStackedNerdlet({
      id: 'timeline-overlay',
      urlState: {
        filter,
        duration: formatSinceAndCompare(timeRange),
        session,
        sessionDate,
        accountId,
      },
    })
    this.setState({ sessionDate, session })
  }

  render() {
    const { entity, timeRange, config } = this.props
    const { loading, hasConfig, filter } = this.state

    if (loading) return <Spinner />
    if (!loading && !hasConfig) {
      return (
        <div className="main__container">
          <ConfigurationContainer />
        </div>
      )
    }
    if (!loading && hasConfig) {
      const { searchAttribute } = config
      const duration = formatSinceAndCompare(timeRange)
      return (
        <div className="main__container">
          <div className="main__search-item">
            <SearchBarContainer
              entity={entity}
              duration={formatSinceAndCompare(timeRange)}
              selectFilter={this.onSelectFilter}
              clearFilter={this.onClearFilter}
            />
          </div>

          {filter && (
            <>
              <div className="main__dashboard-item">
                <Dashboard
                  entity={entity}
                  selected={filter}
                  timeRange={timeRange}
                />
              </div>
              <div className="main__search-results-item">
                <SearchResults
                  entity={entity}
                  selected={filter}
                  duration={duration}
                  timeRange={timeRange}
                  chooseSession={this.onChooseSession}
                />
              </div>
            </>
          )}

          {!filter && (
            <div className="main__empty-item">
              <div className="empty-state">
                <HeadingText
                  className="empty-state-header"
                  type={HeadingText.TYPE.HEADING_3}
                >
                  Search for a(n) {startCase(searchAttribute)} to start
                </HeadingText>
                <div className="empty-state-desc">
                  To get started, please search for and select an item in the
                  search bar above
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }
}

export default withConfigContext(SessionTimelineContainer)
