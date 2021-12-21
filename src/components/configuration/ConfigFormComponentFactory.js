import FormBlock from './FormBlock'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormList from './FormList'

const getSchema = (schema, key) => {
  if (Array.isArray(schema))
    return Object.values(schema).find(s => s.name === key && s.modifiable)
  else return schema.name === key && schema.modifiable ? schema : undefined
}

export const createComponent = (schema, key, value, path) => {
  const schemaItem = getSchema(schema, key)
  if (schemaItem) {
    const schemaPath = path ? path : key
    switch (schemaItem.display) {
      case 'block':
      case 'line':
        return (
          <FormBlock
            path={schemaPath}
            schema={schemaItem}
            values={value}
            type={schemaItem.display}
          />
        )
      case 'dropdown':
        return (
          <FormSelect path={schemaPath} schemaItem={schemaItem} value={value} />
        )
      case 'selectable-list':
        return (
          <FormList path={schemaPath} schemaItem={schemaItem} value={value} />
        )
      default:
        return (
          <FormInput path={schemaPath} schemaItem={schemaItem} value={value} />
        )
    }
  } else return null
}
