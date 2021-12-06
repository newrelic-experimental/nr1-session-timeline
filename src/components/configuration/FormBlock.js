import React from 'react'
import { Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { createComponent } from './ConfigFormComponentFactory'

const FormBlock = ({ schema, values, type, path }) => {
  const blockItems = values.map((value, idx) => {
    return (
      <div className={`config-form__${type}`}>
        {Object.entries(value).map(([key, value]) =>
          schema.children.map(child =>
            createComponent(child, key, value, path + '/' + idx + '/' + key)
          )
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
