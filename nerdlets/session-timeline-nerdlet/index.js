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

                        if (
                          data.entities &&
                          data.entities[0] &&
                          data.entities[0].guid
                        ) {
                          return (
                            <ConfigProvider
                              entityGuid={nerdletUrlState.entityGuid}
                            >
                              <SessionTimelineContainer
                                timeRange={timeRange}
                                nerdletUrlState={nerdletUrlState}
                                entity={data.entities[0]}
                              />
                            </ConfigProvider>
                          )
                        } else {
                          return (
                            <div className="message">
                              <HeadingText>
                                Session Timeline is not available
                              </HeadingText>
                              <BlockText>
                                You have access to this entity, but Session
                                Timeline has not been enabled for Browser
                                entities in this account. Please see your
                                Nerdpack Manager to request access.
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
