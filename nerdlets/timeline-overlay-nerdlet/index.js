import React from 'react'
import {
  PlatformStateContext,
  NerdletStateContext,
  Layout,
  LayoutItem,
} from 'nr1'
import TimelineContainer from '../../src/components/timeline/TimelineContainer'
import { ConfigProvider } from '../../src/context/ConfigContext'

export default class Wrapper extends React.Component {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {launcherUrlState => (
          <NerdletStateContext.Consumer>
            {({
              filter,
              session,
              sessionDate,
              duration,
              entityGuid,
              accountId,
            }) => (
              <ConfigProvider>
                <TimelineContainer
                  accountId={accountId}
                  entityGuid={entityGuid}
                  filter={filter}
                  session={session}
                  sessionDate={sessionDate}
                  duration={duration}
                />
              </ConfigProvider>
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    )
  }
}
