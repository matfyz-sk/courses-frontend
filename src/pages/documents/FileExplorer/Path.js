import React, { useCallback, useEffect, useState } from "react"
import { Breadcrumbs, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { getShortID } from "../../../helperFunctions"
import { makeStyles } from "@material-ui/styles"
import { useLazyGetFolderQuery } from "../../../services/documentsGraph";

const LOOP_ARBITRARY_LIMIT = 50

const useStyles = makeStyles({
    root: {
        color: "#237a23",
        fontStyle: "italic",
    },
})

function Path({ folder, onPathFolderClickHandler }) {
    const classes = useStyles()
    const folderId = folder?._id
    const [getFolder] = useLazyGetFolderQuery()
    const [pathToRootFolder, setPathToRootFolder] = useState([])

    const fetchFolderToRootPath = useCallback(async () => {
        console.log("starting from", folderId)
        if (!folderId) return

        let path = []
        let current = folder
        while (current && path.length < LOOP_ARBITRARY_LIMIT) {
            path.push(current)
            let parentFolder = null
            if (current.parent) {
                parentFolder = await getFolder({ id: current.parent._id }).unwrap()
            }
            current = parentFolder
        }
        if (path.length >= LOOP_ARBITRARY_LIMIT) {
            console.error("Path is too long")
        }
        console.log({path})
        setPathToRootFolder(path.reverse())

    }, [folderId])

    useEffect(() => {
        fetchFolderToRootPath()
    }, [fetchFolderToRootPath])


    return (
        <div>
            <Breadcrumbs style={{ display: "block" }} aria-label="breadcrumb">
                {pathToRootFolder.map((folder, i) =>
                    i !== pathToRootFolder.length - 1 ? (
                        <Link
                            key={folder._id}
                            className={classes.root}
                            onClick={() => onPathFolderClickHandler(getShortID(folder._id))}
                            to={{}}
                        >
                            {folder.name}
                        </Link>
                    ) : (
                        <Typography key={folder._id} color="textPrimary">
                            {folder.name}
                        </Typography>
                    )
                )}
            </Breadcrumbs>
        </div>
    )
}

export default Path
