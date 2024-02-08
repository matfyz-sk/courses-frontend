import React, { useEffect, useState } from "react"
import "../../core/Events/Events.css"
import { getIcon } from "../../core/Helper"
import { Link } from "react-router-dom"
import { DocumentEnums, getEntityName } from "./enums/document-enums"
import downloadBase64File from "./functions/downloadBase64File"
import { Divider, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { customTheme } from "../styles"
import { useGetDocumentsQuery, useLazyGetContentOfDocumentQuery, } from "../../../services/documentsGraph";

const useStyles = makeStyles(() => ({
    listItemRoot: {
        "&:hover": { color: customTheme.palette.primary.main },
    },
}))

function DocumentReferencesList({ onViewableDocumentClick, documentReferences }) {
    const classes = useStyles()
    const isMobile = useMediaQuery("(max-width:600px)")
    const { data: documents } = useGetDocumentsQuery(
        { documentIds: documentReferences.map(ref => ref.document._id) },
        { skip: !documentReferences }
    )
    console.log({ documentReferences })
    console.log({ documents })

    const [getBase64] = useLazyGetContentOfDocumentQuery()


    const loadFile = doc => {
        getBase64({ id: doc._id })
            .unwrap()
            .then(base64 => downloadBase64File(base64, doc.filename, doc.mimeType, window))
    }

    return (
        <List className="event-documents-list" dense>
            {documents && documents.map((doc, i) => {
                const entityName = getEntityName(doc._type)
                console.log({ entityName })
                let navProps
                switch (entityName) {
                    case DocumentEnums.externalDocument.entityName:
                        navProps = {
                            component: "a",
                            href: doc.uri,
                            target: "_blank",
                            rel: "noopener noreferrer",
                        }
                        break
                    default:
                        if (entityName === DocumentEnums.file.entityName && doc.mimeType !== "application/pdf") {
                            navProps = {
                                component: Link,
                                to: {},
                                onClick: () => loadFile(doc),
                            }
                            break
                        }
                        navProps = {
                            component: Link,
                            to: {},
                            onClick: () => onViewableDocumentClick(doc),
                        }
                        break
                }
                return (
                    <div key={doc._id}>
                        <ListItem
                            button={true}
                            className={classes.listItemRoot}
                            style={{ paddingLeft: !isMobile && "10%" }}
                            {...navProps}
                        >
                            <ListItemIcon>{getIcon("Material")}</ListItemIcon>
                            <ListItemText primary={doc.name} />
                        </ListItem>
                        {i !== documents.length - 1 && <Divider />}
                    </div>
                )
            })}
        </List>
    )
}

export default DocumentReferencesList
