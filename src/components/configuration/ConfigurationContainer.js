import React from 'react'
import { BlockText, Button, Tooltip, Icon, Modal, HeadingText } from 'nr1'
import SectionHeader from '../section-header/SectionHeader'
import { withConfigContext } from '../../context/ConfigContext'
import { schema } from '../../data/packSchema'
import { createComponent } from './ConfigFormComponentFactory'

class ConfigurationContainer extends React.PureComponent {
  state = {
    modalHidden: true,
  }

  handleCloseModal = () => this.setState({ modalHidden: true })
  handleResetToDefault = async () => {
    await this.props.deleteConfig()
    this.handleCloseModal()
  }

  render() {
    const {
      saveConfig,
      config,
      firstTime,
      errorMsg,
      cancelEditConfig,
    } = this.props
    const { modalHidden } = this.state

    const formContents = Object.entries(config).map(([key, value]) => {
      return createComponent(schema, key, value)
    })

    return (
      <>
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
                We have provided some default values - at a minimun, make sure
                the Identifier matches the attribute you are capturing in your
                data.
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
                text="Careful! This will replace your existing config with the default settings, and cannot be undone."
              >
                <Button
                  type={Button.TYPE.DESTRUCTIVE}
                  onClick={() => this.setState({ modalHidden: false })}
                >
                  Reset to Defaults
                </Button>
              </Tooltip>
            </div>
          )}
          <div className="config-form__container">
            {errorMsg && (
              <div className="config-form__invalid">
                <Icon
                  type={Icon.TYPE.INTERFACE__OPERATIONS__REMOVE__V_ALTERNATE}
                />
                {errorMsg}
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
        {!modalHidden && (
          <Modal hidden={modalHidden} onClose={this.handleCloseModal}>
            <HeadingText type={HeadingText.TYPE.HEADING_3}>
              Restore Default Config
            </HeadingText>

            <BlockText
              spacingType={[
                BlockText.SPACING_TYPE.EXTRA_LARGE,
                BlockText.SPACING_TYPE.OMIT,
              ]}
            >
              Are you sure? This will reset the config to the default settings,
              and cannot be undone.
            </BlockText>

            <div className="button-row">
              <Button onClick={this.handleCloseModal}>Cancel</Button>
              <Button
                type={Button.TYPE.DESTRUCTIVE}
                onClick={this.handleResetToDefault}
              >
                Continue
              </Button>
            </div>
          </Modal>
        )}
      </>
    )
  }
}

export default withConfigContext(ConfigurationContainer)
