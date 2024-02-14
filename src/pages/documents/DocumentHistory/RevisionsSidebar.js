import { makeStyles, Radio, useMediaQuery } from "@material-ui/core"
import { MdChevronLeft } from "react-icons/md"
import { timestampToString2 } from "../../../helperFunctions"
import { customTheme } from "../styles"
import React from "react"
import { ListGroup, ListGroupItem } from "reactstrap"

const useStyles = makeStyles({
    sidebar: {
        overflow: "scroll",
        width: "20%",
        float: "left",
        verticalAlign: "top",
        borderLeft: "2px solid lightgrey",
        height: "calc(100vh - 80px)",
    },
    sidebarRow: {
        borderWidth: "0 0 1px",
        padding: "10px",
    },
})

export default function RevisionsSidebar({
    versions,
    indexOfVersionBefore,
    indexOfVersionAfter,
    setIndexOfVersionBefore,
    setIndexOfVersionAfter,
    handleRestore,
    setShowSidebar,
}) {
    const style = useStyles()
    const isMobile = useMediaQuery("(max-width:760px)")
    const firstVersion = versions[0]

    const handleVersionAfterChange = e => {
        if (isMobile) {
            setShowSidebar(false)
        }
        const vIndex = parseInt(e.target.value)
        setIndexOfVersionAfter(vIndex)
    }

    const handleVersionBeforeChange = e => {
        if (isMobile) {
            setShowSidebar(false)
        }
        const vIndex = parseInt(e.target.value)
        setIndexOfVersionBefore(vIndex)
    }

    return (
        <div style={{ width: isMobile && "100%" }} className={style.sidebar}>
            <ListGroup flush>
                {isMobile && (
                    <ListGroupItem onClick={() => setShowSidebar(false)}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <MdChevronLeft style={{ fontSize: "200%", color: "grey" }} />
                        </div>
                    </ListGroupItem>
                )}
                {versions.map((v, i) => {
                    return (
                        <ListGroupItem key={v._id} className={style.sidebarRow}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {timestampToString2(v.createdAt?.representation)}

                                {!v.isDeleted && (
                                    <>
                                        <Radio
                                            style={{
                                                visibility: indexOfVersionAfter < i ? "visible" : "hidden",
                                                marginLeft: "auto",
                                                color: customTheme.palette.primary.light,
                                            }}
                                            checked={indexOfVersionBefore === i}
                                            onChange={handleVersionBeforeChange}
                                            value={i}
                                            name="before-revisions"
                                            inputProps={{
                                                "aria-label": `before from ${timestampToString2(
                                                    v.createdAt?.representation
                                                )}`,
                                            }}
                                        />
                                        <Radio
                                            style={{
                                                visibility: i < indexOfVersionBefore ? "visible" : "hidden",
                                                color: customTheme.palette.primary.light,
                                            }}
                                            checked={indexOfVersionAfter === i}
                                            onChange={handleVersionAfterChange}
                                            value={i}
                                            name="after-revisions"
                                            inputProps={{
                                                "aria-label": `after all revisions up to ${timestampToString2(
                                                    v.createdAt?.representation
                                                )}`,
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                            {i === 0 && <p style={{ color: "grey", marginBottom: 0 }}>Current version</p>}
                            {v.isDeleted && <p style={{ color: "grey", marginBottom: 0 }}> Was deleted</p>}
                            {v.restoredFrom && (
                                <p style={{ color: "grey", marginBottom: 0 }}>
                                    Restored from {timestampToString2(v.restoredFrom.representation)}
                                </p>
                            )}
                            {i > 0 && i < versions.length - 1 && (
                                <>
                                    {!firstVersion.isDeleted && !v.isDeleted && (
                                        <a
                                            style={{ color: customTheme.palette.primary.light }}
                                            href=""
                                            onClick={e => handleRestore(e, v)}
                                        >
                                            restore
                                        </a>
                                    )}
                                </>
                            )}
                        </ListGroupItem>
                    )
                })}
            </ListGroup>
        </div>
    )
}
