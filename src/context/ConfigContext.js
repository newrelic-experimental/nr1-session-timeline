import React from 'react'
import { getDocument } from '../data/nerdstore'
import configs from '../data/packDefaults'
import { EntityByGuidQuery, ngql } from 'nr1'

const ConfigContext = React.createContext()

export class ConfigProvider extends React.Component {
  state = {
    configLoading: true,
    config: {},
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

      let config = await getDocument(entityGuid)
      // if (!config) config = configs.find(c => c.type === entity.domain)
      this.setState({
        goldenMetricQueries,
        entity,
        config,
        configLoading: false,
      })
    }
  }

  onSaveConfig = config =>
    this.setState({ config, configLoading: true }, () => {
      this.setState({ configLoading: false })
    })

  render() {
    const { children } = this.props
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
          saveConfig: this.onSaveConfig,
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
      {({ configLoading, config, goldenMetricQueries, entity, saveConfig }) => (
        <WrappedComponent
          configLoading={configLoading}
          config={config}
          goldenMetricQueries={goldenMetricQueries}
          entity={entity}
          saveConfig={saveConfig}
          {...props}
        />
      )}
    </ConfigConsumer>
  )
}
