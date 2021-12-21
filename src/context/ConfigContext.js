import React from 'react'
import jsonpointer from 'jsonpointer'
import cloneDeep from 'lodash.clonedeep'
import { EntityByGuidQuery, ngql } from 'nr1'
import defaults from '../data/packDefaults'
import { schema } from '../data/packSchema'
import { readDocument, writeDocument, deleteDocument } from '../data/nerdstore'

const ConfigContext = React.createContext()
export class ConfigProvider extends React.Component {
  state = {
    configLoading: true,
    config: {},
    preEditConfig: {},
    configValid: true,
    goldenMetricQueries: [],
    entity: undefined,
    firstTime: true,
    editMode: false,
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
      let editMode = false
      if (!config) {
        firstTime = true
        editMode = true
        config = this.defaultConfig(entity)
      }

      // display the top-level attributes in their order of entry in the schema
      config = schema.reduce((acc, s) => {
        acc[s.name] = config[s.name]
        return acc
      }, {})

      this.setState({
        goldenMetricQueries,
        entity,
        config,
        configLoading: false,
        firstTime,
        editMode,
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
    this.setState({ config, configValid: true })
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

  onEditConfig = () => {
    const preEditConfig = cloneDeep(this.state.config)
    this.setState({ editMode: true, preEditConfig })
  }

  onCancelEditConfig = () => {
    const config = cloneDeep(this.state.preEditConfig)
    this.setState({
      editMode: false,
      config,
      preEditConfig: {},
      configValid: true,
    })
  }

  isValid = (path, entry) => {
    let valid = true

    const value = this.getConfigValue(path + entry.name)

    if (entry.mandatory) if (!value) valid = false

    if (valid && value) if (entry.validCheck) valid = entry.validCheck(value)

    if (!valid) console.error('invalid config entry: ', entry, value)
    return valid
  }

  validateConfig = (path = '', schemaItem = schema) => {
    let valid = true

    if (Array.isArray(schemaItem)) {
      valid = schemaItem
        .filter(entry => entry.modifiable)
        .every(entry => {
          if (entry.children) {
            const children = this.getConfigValue(path + entry.name)
            return children.every((child, idx) => {
              return this.validateConfig(
                path + entry.name + '/' + idx + '/',
                entry.children
              )
            })
          } else return this.isValid(path, entry)
        })
    } else valid = this.isValid(path, schemaItem)

    return valid
  }

  onSaveConfig = async () => {
    if (!this.validateConfig()) {
      this.setState({ configValid: false })
    } else {
      const {
        entity: { guid },
        config,
      } = this.state
      await writeDocument(guid, config)
      this.setState(
        {
          config,
          preEditConfig: {},
          configLoading: true,
          firstTime: false,
          editMode: false,
          configValid: true,
        },
        () => {
          this.setState({ configLoading: false })
        }
      )
    }
  }

  onDeleteConfig = async () => {
    const { entity } = this.state
    await deleteDocument(entity.guid)
    this.setState(
      {
        config: this.defaultConfig(entity),
        preEditConfig: {},
        configLoading: true,
        configValid: true,
        firstTime: true,
        editMode: true,
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
          editConfig: this.onEditConfig,
          cancelEditConfig: this.onCancelEditConfig,
          saveConfig: this.onSaveConfig,
          deleteConfig: this.onDeleteConfig,
          changeConfigItem: this.onChangeConfigItem,
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
        configValid,
        firstTime,
        editMode,
        goldenMetricQueries,
        entity,
        editConfig,
        cancelEditConfig,
        saveConfig,
        deleteConfig,
        changeConfigItem,
        addConfigItem,
        deleteConfigItem,
        lookupValue,
      }) => (
        <WrappedComponent
          configLoading={configLoading}
          config={config}
          configValid={configValid}
          firstTime={firstTime}
          editMode={editMode}
          goldenMetricQueries={goldenMetricQueries}
          entity={entity}
          editConfig={editConfig}
          cancelEditConfig={cancelEditConfig}
          saveConfig={saveConfig}
          deleteConfig={deleteConfig}
          changeConfigItem={changeConfigItem}
          addConfigItem={addConfigItem}
          deleteConfigItem={deleteConfigItem}
          lookupValue={lookupValue}
          {...props}
        />
      )}
    </ConfigConsumer>
  )
}
