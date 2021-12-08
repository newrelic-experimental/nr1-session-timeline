import React from 'react'
import jsonpointer from 'jsonpointer'
import cloneDeep from 'lodash.clonedeep'
import { EntityByGuidQuery, ngql } from 'nr1'
import defaults from '../data/packDefaults'
import { readDocument, writeDocument, deleteDocument } from '../data/nerdstore'

const ConfigContext = React.createContext()
export class ConfigProvider extends React.Component {
  state = {
    configLoading: true,
    config: {},
    goldenMetricQueries: [],
    entity: undefined,
    firstTime: true,
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
      let config = await readDocument(entityGuid)
      let firstTime = false
      if (!config) {
        firstTime = true
        config = this.defaultConfig(entity)
      }

      this.setState({
        goldenMetricQueries,
        entity,
        config,
        configLoading: false,
        firstTime,
      })
    }
  }

  defaultConfig = entity => defaults.find(d => d.type === entity.domain)

  getConfigValue = path => {
    return jsonpointer.get(this.state.config, '/' + path)
  }

  onChangeConfigItem = (path, value) => {
    const config = cloneDeep(this.state.config)
    jsonpointer.set(config, '/' + path, value)
    this.setState({ config })
  }

  getEmptyItem = schema => {
    if (schema.children) {
      return schema.children.reduce((acc, child) => {
        acc[child.name] = child.children ? [this.getEmptyItem(child)] : null
        return acc
      }, {})
    }
  }

  onAddConfigItem = (path, schema) => {
    if (schema.children) {
      const config = cloneDeep(this.state.config)
      jsonpointer.set(config, '/' + path + '/-', this.getEmptyItem(schema))
      this.setState({ config })
    }
  }

  onDeleteConfigItem = (path, idx) => {
    const config = cloneDeep(this.state.config)
    jsonpointer.get(config, '/' + path).splice(idx, 1)
    this.setState({ config })
  }

  onSaveConfig = async () => {
    const { entity, config } = this.state
    await writeDocument(entity.guid, config)
    this.setState({ config, configLoading: true, firstTime: false }, () => {
      this.setState({ configLoading: false })
    })
  }

  onDeleteConfig = async () => {
    const { entity } = this.state
    await deleteDocument(entity.guid)
    this.setState(
      {
        config: this.defaultConfig(entity),
        configLoading: true,
        firstTime: true,
      },
      () => {
        this.setState({ configLoading: false })
      }
    )
  }

  render() {
    const { children } = this.props
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
          saveConfig: this.onSaveConfig,
          deleteConfig: this.onDeleteConfig,
          changeConfig: this.onChangeConfigItem,
          addConfigItem: this.onAddConfigItem,
          deleteConfigItem: this.onDeleteConfigItem,
          lookupValue: this.getConfigValue,
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
        firstTime,
        goldenMetricQueries,
        entity,
        saveConfig,
        deleteConfig,
        changeConfig,
        addConfigItem,
        deleteConfigItem,
        lookupValue,
      }) => (
        <WrappedComponent
          configLoading={configLoading}
          config={config}
          firstTime={firstTime}
          goldenMetricQueries={goldenMetricQueries}
          entity={entity}
          saveConfig={saveConfig}
          deleteConfig={deleteConfig}
          changeConfig={changeConfig}
          addConfigItem={addConfigItem}
          deleteConfigItem={deleteConfigItem}
          lookupValue={lookupValue}
          {...props}
        />
      )}
    </ConfigConsumer>
  )
}
