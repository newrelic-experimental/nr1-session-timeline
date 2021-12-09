import React from 'react'
import { TextField, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { withConfigContext } from '../../context/ConfigContext'

const FormInput = ({ path, schemaItem, value, changeConfigItem }) => {
  return (
    <Tooltip
      placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      text={schemaItem.desc}
    >
      <TextField
        defaultValue={value}
        onChange={e => changeConfigItem(path, e.target.value)}
        label={
          schemaItem.title
            ? schemaItem.title
            : transformCamelCaseForDisplay(schemaItem.name)
        }
        className={`config-form__item ${
          schemaItem.mandatory ? 'form-mandatory' : ''
        }`}
      />
    </Tooltip>
  )
}

export default withConfigContext(FormInput)
