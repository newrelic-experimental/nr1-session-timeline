import React from 'react'
import { Tooltip, Button } from 'nr1'
import { withConfigContext } from '../../context/ConfigContext'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { createComponent } from './ConfigFormComponentFactory'

const FormBlock = ({
  schema,
  values,
  type,
  path,
  addConfigItem,
  deleteConfigItem,
}) => {
  const blockName = schema.title
    ? schema.title
    : transformCamelCaseForDisplay(schema.name)

  const blockItems = values.map((value, idx) => {
    return (
      <div className={`config-form__${type}`}>
        {Object.entries(value).map(([key, value]) => {
          return schema.children.map(child =>
            createComponent(child, key, value, path + '/' + idx + '/' + key)
          )
        })}
        <Tooltip placementType={Tooltip.PLACEMENT_TYPE.BOTTOM} text="Remove">
          <Button
            onClick={() => deleteConfigItem(path, idx)}
            className={`delete-button__${type}`}
            type={Button.TYPE.OUTLINE}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
          />
        </Tooltip>
      </div>
    )
  })

  return (
    <div>
      <Tooltip placementType={Tooltip.PLACEMENT_TYPE.RIGHT} text={schema.desc}>
        <div
          className={`config-form__label ${
            schema.mandatory ? 'form-mandatory' : ''
          }`}
        >
          {blockName}
        </div>
      </Tooltip>
      {blockItems}
      <Button
        onClick={() => addConfigItem(path, schema)}
        type={Button.TYPE.OUTLINE}
        sizeType={Button.SIZE_TYPE.SMALL}
        className="config-form__block_button"
      >
        Add {blockName.slice(0, -1)}
      </Button>
    </div>
  )
}

export default withConfigContext(FormBlock)
