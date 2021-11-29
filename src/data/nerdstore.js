import { EntityStorageQuery, EntityStorageMutation } from 'nr1'

const COLLECTION_NAME = 'user-timeline-analysis'
const DOCUMENT_NAME = 'config'

export const getDocument = async guid => {
  const { data, error } = await EntityStorageQuery.query({
    entityGuid: guid,
    collection: COLLECTION_NAME,
    documentId: DOCUMENT_NAME,
  })
  //  const documentResult = data?.
  console.info('getDocument.data', data)
}

export const writeDocument = async () => {}
