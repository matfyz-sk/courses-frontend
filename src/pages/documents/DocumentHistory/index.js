import React, { useCallback, useEffect, useState } from "react"
import { Alert } from "reactstrap"
import { Redirect, withRouter } from "react-router"
import { getShortID } from "../../../helperFunctions"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import "./diff.css"
import "./mdStyling.css"
import { IconButton, makeStyles, ThemeProvider, useMediaQuery } from "@material-ui/core"
import { MdChevronRight } from "react-icons/md"
import { customTheme } from "../styles"
import TextComparator from "./TextComparator"
import RevisionsSidebar from "./RevisionsSidebar"
import EntityComparator from "./EntityComparator"
import { useAddFileMutation, useUpdateFileMutation } from "../../../services/documents"
import {
    useAddExternalDocumentMutation,
    useAddInternalDocumentMutation,
    useGetDocumentReferenceQuery,
    useGetFolderQuery,
    useLazyGetDocumentQuery,
    useUpdateDocumentReferenceMutation,
    useUpdateExternalDocumentMutation,
    useUpdateFolderMutation,
    useUpdateInternalDocumentMutation,
} from "../../../services/documentsGraph"
import { useGetCourseInstanceQuery, useUpdateCourseInstanceMutation } from "../../../services/course"
import { DocumentEnums, getEntityName } from "../common/enums/document-enums"
import { DATA_PREFIX } from "../../../constants/ontology"

const LOOP_ARBITRARY_LIMIT = 100

const useStyles = makeStyles({
    mainPage: {
        display: "table",
        width: "100%",
    },
    versionContentContainer: {
        float: "left",
        width: "80%",
        verticalAlign: "top",
        height: "calc(100vh - 80px)",
        overflow: "scroll",
    },
    versionContent: {
        width: "80%",
        margin: "20px auto",
    },
})

function DocumentHistory({ match, history, location }) {
    const courseId = match.params.course_id
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`
    const style = useStyles()
    const newestVersionId = location.state?.documentId
    const parentFolderId = location.state?.parentFolderId
    const parentFolderFullId = `${DATA_PREFIX}folder/${parentFolderId}`
    const isMobile = useMediaQuery("(max-width:760px)")
    const [showSidebar, setShowSidebar] = useState(false)

    const { data: folder, isError: isFolderError, isFetching: isFolderFetching } = useGetFolderQuery({
        id: parentFolderFullId,
    })

    const [getDocument] = useLazyGetDocumentQuery()
    const [isFetchingHistory, setIsFetchingHistory] = useState(true)

    const [addInternalDocument] = useAddInternalDocumentMutation()
    const [addExternalDocument] = useAddExternalDocumentMutation()
    const [updateInternalDocument] = useUpdateInternalDocumentMutation()
    const [updateExternalDocument] = useUpdateExternalDocumentMutation()
    const [updateDocumentReference] = useUpdateDocumentReferenceMutation()
    const [updateFolder] = useUpdateFolderMutation()
    const [updateCourseInstance] = useUpdateCourseInstanceMutation()

    // REST API
    const [versions, setVersions] = useState([])
    const [addFile] = useAddFileMutation()
    const [updateFile] = useUpdateFileMutation()

    const [error, setError] = useState(null)

    const [indexOfVersionBefore, setIndexOfVersionBefore] = useState(1)
    const [indexOfVersionAfter, setIndexOfVersionAfter] = useState(0)

    const entityName = versions[0] ? getEntityName(versions[0]._type) : ""
    const pickedVersionB = versions.length > 1 ? versions[indexOfVersionBefore] : {}
    const pickedVersionA = versions.length > 1 ? versions[indexOfVersionAfter] : {}

    const {
        data: courseInstanceData,
        isError: isCourseInstanceError,
        isFetching: isCourseInstanceFetching,
    } = useGetCourseInstanceQuery({
        id: courseInstanceFullId,
    })
    const courseInstance = courseInstanceData?.[0]

    const { data: documentReference, isError: isRefError, isFetching: isRefFetching } = useGetDocumentReferenceQuery(
        {
            courseInstanceId: courseInstanceFullId,
            documentId: `${DATA_PREFIX}${entityName}/${newestVersionId}`,
        },
        { skip: !entityName }
    )

    const isFetching = isFolderFetching || isRefFetching || isCourseInstanceFetching || isFetchingHistory
    const isError = isFolderError || isRefError || isCourseInstanceError
    const latestVersion = versions[0]

    const fetchDocumentVersions = useCallback(async () => {
        if (!newestVersionId) return

        let fetchedVersions = []
        let current = await getDocument({ shortId: newestVersionId }).unwrap()
        while (current && fetchedVersions.length < LOOP_ARBITRARY_LIMIT) {
            fetchedVersions.push(current)
            let previousDocumentVersion = null
            if (current.previousDocumentVersion) {
                previousDocumentVersion = await getDocument({ shortId: getShortID(current.previousDocumentVersion._id) }).unwrap()
            }
            current = previousDocumentVersion
        }

        const firstNotDeleted = fetchedVersions.findIndex(doc => !doc.isDeleted)
        const lastNotDeleted = fetchedVersions.findLastIndex(doc => !doc.isDeleted)
        setIndexOfVersionBefore(lastNotDeleted)
        setIndexOfVersionAfter(firstNotDeleted)
        setVersions(fetchedVersions)
        setIsFetchingHistory(false)
    }, [newestVersionId])

    useEffect(() => {
        fetchDocumentVersions()
    }, [fetchDocumentVersions])

    useEffect(() => {
        if (isError) {
            setError(isError)
        }
    }, [isError])

    const handleRestore = async (e, versionToRestore) => {
        e.preventDefault()

        versionToRestore = {
            ...versionToRestore,
            courseInstances: versionToRestore.courseInstances.map(ci => ci._id),
            nextDocumentVersion: null,
            historicDocumentVersions: versions.map(v => v._id),
            restoredFrom: versionToRestore.createdAt?.millis,
            previousDocumentVersion: latestVersion._id,
        }

        try {
            let newVersionId
            if (entityName === DocumentEnums.internalDocument.entityName) {
                newVersionId = await addInternalDocument(versionToRestore).unwrap()
                newVersionId = newVersionId._id
                await updateInternalDocument({
                    id: latestVersion._id,
                    body: { nextDocumentVersion: newVersionId },
                }).unwrap()
            } else if (entityName === DocumentEnums.externalDocument.entityName) {
                newVersionId = await addExternalDocument(versionToRestore).unwrap()
                newVersionId = newVersionId._id
                await updateExternalDocument({
                    id: latestVersion._id,
                    body: { nextDocumentVersion: newVersionId },
                }).unwrap()
            } else if (entityName === DocumentEnums.file.entityName) {
                // REST API because of base64 issues
                newVersionId = await addFile(versionToRestore).unwrap()
                await updateFile({
                    id: getShortID(latestVersion._id),
                    body: { nextDocumentVersion: newVersionId },
                }).unwrap()
            }
            await updateDocumentReference({
                id: documentReference._id,
                body: { document: newVersionId },
            }).unwrap()
            await updateFolder({
                id: parentFolderFullId,
                body: {
                    folderContent: [
                        ...folder.folderContent.map(item => item._id).filter(_id => _id !== latestVersion._id),
                        newVersionId,
                    ],
                },
            }).unwrap()
            await updateCourseInstance({
                id: courseInstanceFullId,
                body: {
                    hasDocument: [
                        ...courseInstance.hasDocument.map(item => item._id).filter(_id => _id !== latestVersion._id),
                        newVersionId,
                    ],
                },
            }).unwrap()

            history.push(
                redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
                    { key: "course_id", value: courseId },
                    { key: "folder_id", value: parentFolderId },
                ])
            )
        } catch (err) {
            setError(err)
            console.log(err)
        }
    }

    if (!location.state) {
        return <Redirect to={redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }])} />
    }

    if (isFetching) {
        return (
            <Alert color="secondary" className="empty-message">
                Loading...
            </Alert>
        )
    }

    if (error) {
        return <Alert color="warning"> There has been an error! </Alert>
    }

    return (
        <ThemeProvider theme={customTheme}>
            <div className={style.mainPage}>
                {(!isMobile || !showSidebar) && (
                    <div style={{ width: isMobile && "100%" }} className={style.versionContentContainer}>
                        <div
                            className="diffing"
                            style={{
                                width: isMobile ? "100%" : "70%",
                                margin: "10px auto",
                                padding: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <h5>Name:</h5>
                                {isMobile && !showSidebar && (
                                    <IconButton
                                        style={{ marginLeft: "auto", outline: "none" }}
                                        onClick={() => setShowSidebar(true)}
                                    >
                                        <MdChevronRight />
                                    </IconButton>
                                )}
                            </div>
                            <TextComparator textA={pickedVersionA?.name ?? ""} textB={pickedVersionB?.name ?? ""} />
                            <EntityComparator
                                entityName={entityName}
                                pickedVersionA={pickedVersionA}
                                pickedVersionB={pickedVersionB}
                            />
                        </div>
                    </div>
                )}
                {(!isMobile || showSidebar) && (
                    <RevisionsSidebar
                        versions={versions}
                        indexOfVersionBefore={indexOfVersionBefore}
                        indexOfVersionAfter={indexOfVersionAfter}
                        setIndexOfVersionBefore={setIndexOfVersionBefore}
                        setIndexOfVersionAfter={setIndexOfVersionAfter}
                        handleRestore={handleRestore}
                        setShowSidebar={setShowSidebar}
                    />
                )}
            </div>
        </ThemeProvider>
    )
}

export default withRouter(DocumentHistory)
