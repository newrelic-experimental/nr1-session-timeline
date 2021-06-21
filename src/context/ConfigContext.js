import React from 'react'
import baseConfig from '../../src/config/config'

const ConfigContext = React.createContext()

export class ConfigProvider extends React.Component {
  state = {
    config: baseConfig,
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
    {({ config }) => <WrappedComponent config={config} {...props} />}
  </ConfigConsumer>
)
