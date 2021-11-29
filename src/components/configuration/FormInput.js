import React from 'react'
import { TextField, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'

const FormInput = ({ schemaItem, value }) => {
  return (
    <Tooltip
      placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      text={schemaItem.desc}
    >
      <TextField
        defaultValue={value}
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

export default FormInput
