import React from 'react'
import { Select, SelectItem, Tooltip } from 'nr1'
import { transformCamelCaseForDisplay } from '../../utils/text-formatter'
import { withConfigContext } from '../../context/ConfigContext'
import FormInput from './FormInput'

const FormSelect = ({
  path,
  schemaItem,
  value,
  lookupValue,
  changeConfigItem,
}) => {
  const selectItems = lookupValue(schemaItem.source)
  return (
    <Tooltip
      placementType={Tooltip.PLACEMENT_TYPE.RIGHT}
      text={schemaItem.desc}
    >
      {selectItems ? (
        <Select
          className="config-form__item"
          value={value}
          onChange={(event, value) => changeConfigItem(path, value)}
          required={schemaItem.mandatory}
          invalid={
            schemaItem.mandatory && !value ? 'Please select a value' : ''
          }
          label={
            schemaItem.title
              ? schemaItem.title
              : transformCamelCaseForDisplay(schemaItem.name)
          }
        >
          <SelectItem value="">Choose One</SelectItem>
          {selectItems.map(item => (
            <SelectItem value={item}>{item}</SelectItem>
          ))}
        </Select>
      ) : (
        <FormInput path={path} schemaItem={schemaItem} value={value} />
      )}
    </Tooltip>
  )
}

export default withConfigContext(FormSelect)
