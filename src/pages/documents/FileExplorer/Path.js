import React from "react"
import { Breadcrumbs, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { getShortID } from "../../../helperFunctions"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
    root: {
        color: "#237a23",
        fontStyle: "italic",
    },
})

function Path({ fsPath, onPathFolderClickHandler }) {
    const classes = useStyles()

    return (
        <div>
            <Breadcrumbs style={{ display: "block" }} aria-label="breadcrumb">
                {fsPath.map((folder, i) =>
                    i !== fsPath.length - 1 ? (
                        <Link
                            key={folder["_id"]}
                            className={classes.root}
                            onClick={() => onPathFolderClickHandler(getShortID(folder["_id"]))}
                            to={{}}
                        >
                            {folder.name}
                        </Link>
                    ) : (
                        <Typography key={folder["_id"]} color="textPrimary">
                            {folder.name}
                        </Typography>
                    )
                )}
            </Breadcrumbs>
        </div>
    )
}

export default Path
