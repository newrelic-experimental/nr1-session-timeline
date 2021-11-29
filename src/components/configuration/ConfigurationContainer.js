import React from 'react'
import { BlockText, Button } from 'nr1'
import SectionHeader from '../section-header/SectionHeader'
import { withConfigContext } from '../../context/ConfigContext'
import defaults from '../../data/packDefaults'
import { schema } from '../../data/packSchema'
import { createComponent } from './ConfigFormComponentFactory'

class ConfigurationContainer extends React.PureComponent {
  render() {
    const { entity, saveConfig } = this.props
    const config = defaults.find(d => d.type === entity.domain)
    const formContents = Object.entries(config).map(([key, value]) => {
      return createComponent(schema, key, value)
    })

    return (
      <div className="init-config__container">
        <SectionHeader header="First Time Set Up" />
        <BlockText
          type={BlockText.TYPE.PARAGRAPH}
          className="init-config__desc"
        >
          Please complete the form below to start using the User Session
          Analysis app.
        </BlockText>

        <BlockText
          type={BlockText.TYPE.PARAGRAPH}
          className="init-config__desc"
        >
          We have provided some default values - please make sure the User
          Identifier matches the user attribute you are capturing in your data.
        </BlockText>

        <BlockText
          type={BlockText.TYPE.PARAGRAPH}
          className="init-config__desc"
        >
          When you are ready, go ahead and click Continue. You will be able to
          change these at any time in the app's configuration menu.
        </BlockText>

        <div className="config-form__container">
          {formContents}
          <div className="button-row">
            <Button
              onClick={() => saveConfig(config)}
              type={Button.TYPE.PRIMARY}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withConfigContext(ConfigurationContainer)
