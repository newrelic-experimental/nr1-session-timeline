import React from 'react'
import {
  AutoSizer,
  PlatformStateContext,
  NerdletStateContext,
  EntityByGuidQuery,
  HeadingText,
  BlockText,
  Spinner,
} from 'nr1'
import { ConfigProvider } from '../../src/context/ConfigContext'
import SessionTimelineContainer from './SessionTimelineContainer'

export default class Wrapper extends React.Component {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {({ timeRange }) => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <AutoSizer>
                {({ width, height }) => (
                  <div style={{ width, height, overflowX: 'hidden' }}>
                    <EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                      {({ data, loading, error }) => {
                        if (loading) {
                          return <Spinner fillContainer />
                        }
                        if (error) {
                          return <BlockText>{error.message}</BlockText>
                        }

                        if (data.entities[0]?.guid) {
                          return (
                            <ConfigProvider
                              entityGuid={nerdletUrlState.entityGuid}
                            >
                              <SessionTimelineContainer
                                timeRange={timeRange}
                                nerdletUrlState={nerdletUrlState}
                              />
                            </ConfigProvider>
                          )
                        } else {
                          return (
                            <div className="empty-state">
                              <HeadingText className="empty-state-header">
                                Session Timeline is not enabled
                              </HeadingText>
                              <BlockText className="empty-state-desc">
                                Session Timeline has not been enabled for
                                entities in this account.
                              </BlockText>
                              <BlockText className="empty-state-desc">
                                To enable, please contact your NR Admin, or
                                confirm that the Session Timeline nerdpack was{' '}
                                <a
                                  href="https://developer.newrelic.com/build-apps/publish-deploy/publish/"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  published
                                </a>{' '}
                                to the correct account profile.
                              </BlockText>
                            </div>
                          )
                        }
                      }}
                    </EntityByGuidQuery>
                  </div>
                )}
              </AutoSizer>
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    )
  }
}
