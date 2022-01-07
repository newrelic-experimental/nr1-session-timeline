import React from 'react'
import { Checkbox, CheckboxGroup, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { withConfigContext } from '../../context/ConfigContext'
import FormInput from './FormInput'

const FormList = ({
  path,
  schemaItem,
  value,
  lookupValue,
  changeConfigItem,
}) => {
  const items = lookupValue(path)
  const selectedItems = value.filter(v => v.selected)
  return (
    <Tooltip placementType={Tooltip.PLACEMENT_TYPE.TOP} text={schemaItem.desc}>
      {items ? (
        <CheckboxGroup
          className="config-form__item"
          value={selectedItems}
          required={schemaItem.mandatory}
          invalid={
            schemaItem.mandatory &&
            (!selectedItems || selectedItems.length === 0)
              ? 'Please select at least one value'
              : ''
          }
          label={
            schemaItem.title
              ? schemaItem.title
              : transformCamelCaseForDisplay(schemaItem.name)
          }
        >
          {items.map((item, idx) => (
            <Checkbox
              value={item}
              label={item.name}
              onChange={event =>
                changeConfigItem(path + '/' + idx, {
                  name: item.name,
                  selected: event.target.checked,
                })
              }
            />
          ))}
        </CheckboxGroup>
      ) : (
        <FormInput path={path} schemaItem={schemaItem} value={value} />
      )}
    </Tooltip>
  )
}

export default withConfigContext(FormList)
