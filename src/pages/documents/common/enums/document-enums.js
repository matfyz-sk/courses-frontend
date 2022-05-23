import { ONTOLOGY_PREFIX } from "../../../../constants/ontology";

export const DocumentEnums = Object.freeze({
  internalDocument: {
    id: `${ ONTOLOGY_PREFIX }InternalDocument`,
    entityName: 'internalDocument',
    name: 'Internal Document',
  },
  externalDocument: {
    id: `${ ONTOLOGY_PREFIX }ExternalDocument`,
    entityName: 'externalDocument',
    name: 'External Document',
  },
  file: {
    id: `${ ONTOLOGY_PREFIX }File`,
    entityName: 'file',
    name: 'File',
  },
  material: {
    id: `${ ONTOLOGY_PREFIX }Material`,
    entityName: 'material',
    name: 'Material',
  },
  folder: {
    id: `${ ONTOLOGY_PREFIX }Folder`,
    entityName: 'folder',
    name: 'Folder',
  },
})
