import React from 'react'
import { readDocument, writeDocument, deleteDocument } from '../data/nerdstore'
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

      console.info('entity', entity)

      let config = await readDocument(entityGuid)
      // if (!config) config = configs.find(c => c.type === entity.domain)
      this.setState({
        goldenMetricQueries,
        entity,
        config,
        configLoading: false,
      })
    }
  }

  onSaveConfig = async config => {
    const { entity } = this.state
    await writeDocument(entity.guid, config)
    this.setState({ config, configLoading: true }, () => {
      this.setState({ configLoading: false })
    })
  }

  onDeleteConfig = async () => {
    const { entity } = this.state
    await deleteDocument(entity.guid)
    this.setState({ config: null, configLoading: true }, () => {
      this.setState({ configLoading: false })
    })
  }

  render() {
    const { children } = this.props
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
          saveConfig: this.onSaveConfig,
          deleteConfig: this.onDeleteConfig,
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
      {({
        configLoading,
        config,
        goldenMetricQueries,
        entity,
        saveConfig,
        deleteConfig,
      }) => (
        <WrappedComponent
          configLoading={configLoading}
          config={config}
          goldenMetricQueries={goldenMetricQueries}
          entity={entity}
          saveConfig={saveConfig}
          deleteConfig={deleteConfig}
          {...props}
        />
      )}
    </ConfigConsumer>
  )
}
