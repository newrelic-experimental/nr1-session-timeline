import React from 'react'
import { Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { createComponent } from './ConfigFormComponentFactory'

const FormBlock = ({ schema, values, type }) => {
  const blockItems = values.map(value => {
    return (
      <div className={`config-form__${type}`}>
        {Object.entries(value).map(([key, value]) =>
          schema.children.map(child => createComponent(child, key, value))
        )}
      </div>
    )
  })

  return (
    <div>
      <div>
        <Tooltip
          placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
          text={schema.desc}
        >
          <div
            className={`config-form__label ${
              schema.mandatory ? 'form-mandatory' : ''
            }`}
          >
            {schema.title
              ? schema.title
              : transformCamelCaseForDisplay(schema.name)}
          </div>
        </Tooltip>
      </div>
      {blockItems}
    </div>
  )
}

export default FormBlock
