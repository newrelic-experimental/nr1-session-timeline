import React from 'react'
import { BlockText, Button, Tooltip, Icon } from 'nr1'
import SectionHeader from '../section-header/SectionHeader'
import { withConfigContext } from '../../context/ConfigContext'
import { schema } from '../../data/packSchema'
import { createComponent } from './ConfigFormComponentFactory'

class ConfigurationContainer extends React.PureComponent {
  render() {
    const {
      saveConfig,
      config,
      configValid,
      firstTime,
      deleteConfig,
      cancelEditConfig,
    } = this.props

    const formContents = Object.entries(config).map(([key, value]) => {
      return createComponent(schema, key, value)
    })

    return (
      <div className="init-config__container">
        {firstTime ? (
          <>
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
              We have provided some default values - at a minimun, make sure the
              User Identifier matches the user attribute you are capturing in
              your data.
            </BlockText>

            <BlockText
              type={BlockText.TYPE.PARAGRAPH}
              className="init-config__desc"
            >
              When you are ready, click Continue. You will be able to change
              these at any time in the app's configuration menu.
            </BlockText>
          </>
        ) : (
          <div className="config-form__header-edit">
            <SectionHeader header="Edit Configuration" />
            <Tooltip
              placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
              text="Careful! This will delete your existing config and cannot be undone."
            >
              <Button type={Button.TYPE.DESTRUCTIVE} onClick={deleteConfig}>
                Reset to Defaults
              </Button>
            </Tooltip>
          </div>
        )}
        <div className="config-form__container">
          {!configValid && (
            <div className="config-form__invalid">
              <Icon
                type={Icon.TYPE.INTERFACE__OPERATIONS__REMOVE__V_ALTERNATE}
              />
              Please complete all required fields.
            </div>
          )}
          {formContents}
        </div>
        <div className="button-row">
          <Button onClick={saveConfig} type={Button.TYPE.PRIMARY}>
            {firstTime ? 'Continue' : 'Save'}
          </Button>
          {!firstTime && <Button onClick={cancelEditConfig}>Cancel</Button>}
        </div>
      </div>
    )
  }
}

export default withConfigContext(ConfigurationContainer)
