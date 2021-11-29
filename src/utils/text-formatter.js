export const transformCamelCaseForDisplay = textToTransform => {
  return textToTransform
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}
