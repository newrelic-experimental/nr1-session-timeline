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
      config,
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
        config,
      },
    })
    this.setState({ sessionDate, session })
  }

  render() {
    const {
      entity,
      timeRange,
      firstTime,
      config,
      configLoading: loading,
    } = this.props
    const { filter } = this.state

    if (loading) return <Spinner />
    if (!loading && firstTime) {
      return (
        <div className="main__container">
          <ConfigurationContainer />
        </div>
      )
    }
    if (!loading && config) {
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
