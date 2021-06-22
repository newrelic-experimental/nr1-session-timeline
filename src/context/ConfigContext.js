import React from 'react'
import baseConfig from '../../src/config/config'
import { EntityByGuidQuery, ngql } from 'nr1'

const ConfigContext = React.createContext()

export class ConfigProvider extends React.Component {
  state = {
    config: baseConfig,
    goldenMetricQueries: [],
    accountId: undefined,
  }

  async componentDidMount() {
    const { entityGuid } = this.props
    const { data } = await EntityByGuidQuery.query({
      entityGuid: [entityGuid],
      entityFragmentExtension: ngql`
        fragment EntityFragmentExtension on EntityOutline {
          goldenMetrics {
              metrics {
                query
                title
              }
            }
        }
      `,
    })

    const goldenMetricQueries = data?.entities?.[0]?.goldenMetrics?.metrics?.reduce(
      (acc, gm) => {
        acc.push({ name: gm.title, query: gm.query })
        return acc
      },
      []
    )
    const accountId = data?.entities?.[0]?.accountId

    this.setState({ goldenMetricQueries, accountId })
  }

  render() {
    const { children } = this.props
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
        }}
      >
        {children}
      </ConfigContext.Provider>
    )
  }
}

export const ConfigConsumer = ConfigContext.Consumer
export default ConfigContext

export const withConfigContext = WrappedComponent => props => (
  <ConfigConsumer>
    {({ config, goldenMetricQueries, accountId }) => (
      <WrappedComponent
        config={config}
        goldenMetricQueries={goldenMetricQueries}
        accountId={accountId}
        {...props}
      />
    )}
  </ConfigConsumer>
)
