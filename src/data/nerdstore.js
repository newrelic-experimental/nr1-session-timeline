import { EntityStorageQuery, EntityStorageMutation } from 'nr1'

const COLLECTION_NAME = 'user-session-analysis'
const DOCUMENT_NAME = 'config'

export const readDocument = async guid => {
  try {
    const { data } = await EntityStorageQuery.query({
      entityGuid: guid,
      collection: COLLECTION_NAME,
      documentId: DOCUMENT_NAME,
    })
    return data
  } catch (error) {
    console.error('nerdstore.readDocument', error)
  }
}

export const writeDocument = async (guid, payload) => {
  console.info('writeDoc', guid, payload)
  try {
    const { data } = await EntityStorageMutation.mutate({
      entityGuid: guid,
      actionType: EntityStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: COLLECTION_NAME,
      documentId: DOCUMENT_NAME,
      document: payload,
    })
    return data
  } catch (error) {
    console.error('nerdstore.writeDocument', error)
    throw error
  }
}

export const deleteDocument = async guid => {
  try {
    const { data } = await EntityStorageMutation.mutate({
      entityGuid: guid,
      actionType: EntityStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
      collection: COLLECTION_NAME,
      documentId: DOCUMENT_NAME,
    })
    return data
  } catch (error) {
    console.error('nerdstore.deleteDocument', error)
  }
}
