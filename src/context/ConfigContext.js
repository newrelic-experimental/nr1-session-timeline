import React from 'react'
import baseConfig from '../../src/config/config'
import { EntityByGuidQuery, ngql } from 'nr1'

const ConfigContext = React.createContext()

export class ConfigProvider extends React.Component {
  state = {
    config: baseConfig,
    goldenMetricQueries: [],
    entity: undefined,
  }

  async componentDidMount() {
    const { entityGuid } = this.props
    if (entityGuid) {
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
          acc.push({ title: gm.title, query: gm.query })
          return acc
        },
        []
      )

      const entity = data?.entities?.[0]
      this.setState({ goldenMetricQueries, entity })
    }
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

export const withConfigContext = WrappedComponent => props => {
  return (
    <ConfigConsumer>
      {({ config, goldenMetricQueries, entity }) => (
        <WrappedComponent
          config={config}
          goldenMetricQueries={goldenMetricQueries}
          entity={entity}
          {...props}
        />
      )}
    </ConfigConsumer>
  )
}
