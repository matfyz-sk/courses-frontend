import React, { useCallback, useEffect, useState } from "react"
import { Alert } from "reactstrap"
import { withRouter } from "react-router"
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
import { useLazyGetDocumentQuery } from "../../../services/documentsGraph"
import { getEntityName } from "../common/enums/document-enums"
import { DATA_PREFIX } from "../../../constants/ontology"
import useDocument from "../common/useDocument"

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

function DocumentHistory({ match, history }) {
    const courseId = match.params.course_id
    const newestVersionId = match.params.document_id
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`
    const style = useStyles()
    const isMobile = useMediaQuery("(max-width:760px)")
    const [showSidebar, setShowSidebar] = useState(false)

    const [getDocument] = useLazyGetDocumentQuery()
    const [isFetchingHistory, setIsFetchingHistory] = useState(true)

    // REST API
    const [versions, setVersions] = useState([])

    const [error, setError] = useState(null)

    const [indexOfVersionBefore, setIndexOfVersionBefore] = useState(1)
    const [indexOfVersionAfter, setIndexOfVersionAfter] = useState(0)

    const entityName = versions[0] ? getEntityName(versions[0]._type) : ""
    const pickedVersionB = versions.length > 1 ? versions[indexOfVersionBefore] : {}
    const pickedVersionA = versions.length > 1 ? versions[indexOfVersionAfter] : {}

    const { createNextDocumentVersion, error: newVersionError } = useDocument()

    const isFetching = isFetchingHistory
    const isError = newVersionError
    const latestVersion = versions[0]

    const fetchDocumentVersions = useCallback(async () => {
        if (!newestVersionId) return

        let fetchedVersions = []
        let current = await getDocument({ shortId: newestVersionId }).unwrap()
        while (current && fetchedVersions.length < LOOP_ARBITRARY_LIMIT) {
            fetchedVersions.push(current)
            let previousDocumentVersion = null
            if (current.previousDocumentVersion) {
                previousDocumentVersion = await getDocument({
                    shortId: getShortID(current.previousDocumentVersion._id),
                }).unwrap()
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
            console.error(isError)
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

        const newDocument = await createNextDocumentVersion({
            previousVersionId: latestVersion._id,
            entityName,
            body: versionToRestore,
            courseInstanceId: courseInstanceFullId,
        })
        if (!newDocument) {
            return
        }

        history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
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
