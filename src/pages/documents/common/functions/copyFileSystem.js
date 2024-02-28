import {
    axiosAddEntity,
    axiosGetEntities,
    axiosUpdateEntity,
    getIRIFromAddResponse,
    getResponseBody,
    getShortID,
    getShortType,
} from "../../../../helperFunctions"
import { DocumentEnums } from "../enums/document-enums"

async function copyFolder(folderId, parentId, courseInstanceId) {
    // folder content is objects of folders which will be recursively created
    //    + ids of documents
    const response = await axiosGetEntities(`folder/${folderId}?_join=content`)
    const oldFolder = getResponseBody(response)[0]

    const newFolder = {
        name: oldFolder.name,
        parent: parentId,
        courseInstance: courseInstanceId,
        isDeleted: false,
    }
    const newFolderResponse = await axiosAddEntity(newFolder, "folder")
    const newFolderId = getIRIFromAddResponse(newFolderResponse)

    const folderNewContent = []
    for (const fsObject of oldFolder.content) {
        if (typeof fsObject["@type"] !== "string") {
            continue // TODO multiple types
        }
        if (getShortType(fsObject["@type"]) === DocumentEnums.folder.entityName) {
            if (!fsObject.isDeleted) {
                folderNewContent.push(await copyFolder(getShortID(fsObject["_id"]), newFolderId, courseInstanceId))
            }
            continue
        }
        const fsObjectUpdate = {
            courseInstance: [
                ...oldFolder.courseInstance.map(ci => ci["_id"]).filter(ciId => ciId !== courseInstanceId),
                courseInstanceId,
            ],
        }
        const entityName = getShortType(fsObject["@type"])
        axiosUpdateEntity(fsObjectUpdate, `${entityName}/${getShortID(fsObject["_id"])}`)
        folderNewContent.push(fsObject["_id"])
    }
    axiosUpdateEntity({ content: folderNewContent }, `folder/${getShortID(newFolderId)}`)
    return newFolderId
}

export default async function copyFileSystem(fileExplorerRoot, courseInstanceId) {
    const newRootFolderId = await copyFolder(getShortID(fileExplorerRoot["_id"]), null, courseInstanceId)
    return newRootFolderId
}
