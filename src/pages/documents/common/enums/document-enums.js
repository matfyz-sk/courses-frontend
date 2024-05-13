import { ONTOLOGY_PREFIX } from "../../../../constants/ontology"

export const getEntityName = fullType => {
    return fullType?.split("#")?.[1]?.toLowerCase() ?? ""
}

export const getIdByEntityName = entityName => {
    switch (entityName) {
        case DocumentEnums.internalDocument.entityName:
            return DocumentEnums.internalDocument.id
        case DocumentEnums.externalDocument.entityName:
            return DocumentEnums.externalDocument.id
        case DocumentEnums.file.entityName:
            return DocumentEnums.file.id
        case DocumentEnums.material.entityName:
            return DocumentEnums.material.id
        case DocumentEnums.folder.entityName:
            return DocumentEnums.folder.id
        default:
            return ""
    }
}

export const DocumentEnums = Object.freeze({
    internalDocument: {
        id: `${ONTOLOGY_PREFIX}InternalDocument`,
        entityName: "internaldocument",
        name: "Internal Document",
        capitalized: "InternalDocument",
    },
    externalDocument: {
        id: `${ONTOLOGY_PREFIX}ExternalDocument`,
        entityName: "externaldocument",
        name: "External Document",
        capitalized: "ExternalDocument",
    },
    file: {
        id: `${ONTOLOGY_PREFIX}File`,
        entityName: "file",
        name: "File",
        capitalized: "File",
    },
    material: {
        id: `${ONTOLOGY_PREFIX}Material`,
        entityName: "material",
        name: "Material",
        capitalized: "Material",
    },
    folder: {
        id: `${ONTOLOGY_PREFIX}Folder`,
        entityName: "folder",
        name: "Folder",
        capitalized: "Folder",
    },
})
