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
        id: `${ONTOLOGY_PREFIX}Internaldocument`,
        entityName: "internaldocument",
        name: "Internal Document",
    },
    externalDocument: {
        id: `${ONTOLOGY_PREFIX}Externaldocument`,
        entityName: "externaldocument",
        name: "External Document",
    },
    file: {
        id: `${ONTOLOGY_PREFIX}File`,
        entityName: "file",
        name: "File",
    },
    material: {
        id: `${ONTOLOGY_PREFIX}Material`,
        entityName: "material",
        name: "Material",
    },
    folder: {
        id: `${ONTOLOGY_PREFIX}Folder`,
        entityName: "folder",
        name: "Folder",
    },
})
