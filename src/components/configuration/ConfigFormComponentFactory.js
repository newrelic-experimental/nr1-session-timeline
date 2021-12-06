import FormBlock from './FormBlock'
import FormInput from './FormInput'

const getSchema = (schema, key) => {
  if (Array.isArray(schema))
    return Object.values(schema).find(s => s.name === key && s.modifiable)
  else return schema.name === key && schema.modifiable ? schema : undefined
}

export const createComponent = (schema, key, value, path) => {
  const schemaItem = getSchema(schema, key)
  if (schemaItem) {
    const schemaPath = path ? path : key
    if (schemaItem.display === 'block' || schemaItem.display === 'line')
      return (
        <FormBlock
          path={schemaPath}
          schema={schemaItem}
          values={value}
          type={schemaItem.display}
        />
      )
    else
      return (
        <FormInput path={schemaPath} schemaItem={schemaItem} value={value} />
      )
  } else return null
}
