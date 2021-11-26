import React from 'react'
import { Tooltip } from 'nr1'
import { withConfigContext } from '../../context/ConfigContext'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import FormSection from './FormSection'
import FormInput from './FormInput'

class ConfigForm extends React.Component {
  renderItem = (schemaItem, name, value) => {
    if (schemaItem?.children) {
      return
      // return (
      //   <>
      //     <Tooltip
      //       placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      //       text={schemaItem.desc}
      //     >
      //       <label
      //         className={`config-form__label ${
      //           schemaItem.mandatory ? 'form-mandatory' : ''
      //         }`}
      //       >
      //         {transformCamelCaseForDisplay(name)}
      //       </label>
      //     </Tooltip>
      //     <ConfigForm
      //       config={value}
      //       schema={schemaItem.children}
      //     />
      //   </>
      // )
    } else return <FormInput schemaItem={schemaItem} value={value} />
  }

  renderInput = (name, value) => {
    const { schema } = this.props
    // console.info('configForm.schema', schema)
    // console.info('configForm.renderInput', name, value)

    let schemaItem
    if (Array.isArray(schema))
      schemaItem = schema.find(s => s.name === name && s.modifiable)
    else
      schemaItem =
        schema.name === name && schema.modifiable ? schema : undefined

    // console.info('configForm.schemaItem', schemaItem)

    if (schemaItem) return this.renderItem(schemaItem, name, value)
  }

  renderInputs = config => {
    return Object.entries(config).map(([key, value]) =>
      this.renderInput(key, value)
    )
  }

  render() {
    const { config, className } = this.props
    console.info('configForm.config', config)

    let formContents = undefined
    if (Array.isArray(config)) {
      formContents = (
        <div className={config.display ? config.display : ''}>
          {config.map((c, idx) => (
            <React.Fragment key={idx}>{this.renderInputs(c)}</React.Fragment>
          ))}
        </div>
      )
    } else formContents = this.renderInputs(config)

    return (
      <div className={`config-form__container ${className ? className : ''}`}>
        {formContents}
        {/* {inputs.map((input, idx) => (
          <React.Fragment key={idx}>{input}</React.Fragment>
        ))} */}
      </div>
    )
  }
}

export default withConfigContext(ConfigForm)
