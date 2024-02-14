import React, { useState } from "react"
import {
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
    withStyles,
} from "@material-ui/core"
import { timestampToString2 } from "../../../helperFunctions"
import { withRouter } from "react-router"
import { MdContentPaste, MdEdit, MdMoreVert } from "react-icons/md"
import { DocumentEnums, getEntityName } from "../common/enums/document-enums"
import { customTheme, useFileExplorerStyles } from "../styles"
import FileIcon from "../common/FileIcon"
import { connect } from "react-redux"
import EnhancedTableHead from "./EnhancedTableHead"
import Path from "./Path"

const CustomTableRow = withStyles({
    root: {
        "&$hover:hover": {
            backgroundColor: "x",
            cursor: "pointer",
        },
    },
    selected: {},
    hover: {},
})(TableRow)

const CustomListItemIcon = withStyles({
    root: {
        minWidth: "30px",
        color: customTheme.palette.primary.main,
    },
})(ListItemIcon)

function descendingComparator(a, b, orderBy) {
    if (orderBy === "_type") {
        const aEntityName = getEntityName(a["_type"])
        const bEntityName = getEntityName(b["_type"])
        if (bEntityName !== DocumentEnums.folder.entityName && aEntityName === DocumentEnums.folder.entityName)
            return -1
        if (bEntityName === DocumentEnums.folder.entityName && aEntityName !== DocumentEnums.folder.entityName) return 1
        return 0
    }

    const x = orderBy === "createdAt" ? new Date(b.createdAt) : b.name
    const y = orderBy === "createdAt" ? new Date(a.createdAt) : a.name
    if (x < y) {
        return -1
    }
    if (x > y) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
}

function FileExplorer({
    files,
    search,
    folder,
    // fsPath,
    onRowClickHandler,
    onPathFolderClickHandler,
    onPaste,
    onCut,
    isRelocator,
    editFolder,
    clipboard,
    hasActionColumn,
}) {
    const classes = useFileExplorerStyles()
    const [anchorEls, setAnchorEls] = React.useState([])
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("createdAt")

    const handleOptionsClick = (event, i) => {
        let newAnchorEls = anchorEls.slice()
        newAnchorEls[i] = event.currentTarget
        setAnchorEls(newAnchorEls)
    }

    const handleOptionsClose = (event, i, file, additionalAction = "") => {
        let newAnchorEls = anchorEls.slice()
        newAnchorEls[i] = null
        setAnchorEls(newAnchorEls)
        switch (additionalAction) {
            case "folder edit":
                editFolder(file)
                break
            case "relocate":
                onCut(file)
                break
            default:
                break
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }
    const handleClick = (event, fsObject) => {
        onRowClickHandler(event, fsObject)
    }

    const filterSearched = toBeSearched => {
        if (!search) return toBeSearched
        return toBeSearched.filter(f => f.name.includes(search) || timestampToString2(f.createdAt).includes(search))
    }

    const prepareFolders = files => {
        // weird workaround, basically to see when the folder was changed I use lastChanged parameter
        // but with documents I always use createdAt since I always create a new version of the document (and that's because of history versioning)
        return files.map(file => {
            if (file.lastChanged) {
                return { ...file, createdAt: file.lastChanged }
            }
            return file
        })
    }

    const filterToBeCut = files => {
        if (isRelocator && clipboard.beingCut) {
            return files.filter(file => file["_id"] !== clipboard.beingCut["_id"])
        }
        return files
    }

    const normalizeCreatedAtParameter = fsObjects => {
        // Only reason for this is because documents of type File are created still through REST API and
        // createdAt is not in the right format as with UGQL created entities
        return fsObjects.map(fsObject => {
            return {
                ...fsObject,
                createdAt: fsObject.createdAt?.representation ? fsObject.createdAt.representation : fsObject.createdAt,
            }
        })
    }

    const prepareFsObjects = fsObjects => {
        let filteredFsObjects = filterSearched(filterToBeCut(prepareFolders(normalizeCreatedAtParameter(fsObjects))))
        return stableSort(stableSort(filteredFsObjects, getComparator(order, orderBy)), getComparator("desc", "_type"))
    }

    return (
        <div className={classes.root}>
            <Paper elevation={4} className={classes.paper}>
                <TableContainer>
                    <Toolbar>
                        <Path
                            // fsPath={fsPath}
                            folder={folder}
                            onPathFolderClickHandler={onPathFolderClickHandler}
                        />
                        {isRelocator && (
                            <IconButton
                                aria-label={"show options"}
                                aria-haspopup={true}
                                onClick={e => onPaste(e, folder)}
                                size="small"
                                style={{ fontSize: "90%", outline: "none", marginLeft: "auto" }}
                            >
                                <MdContentPaste className={classes.actionsButton} />
                            </IconButton>
                        )}
                    </Toolbar>
                    <Table size="small" aria-label="file explorer table" stickyHeader>
                        <colgroup>
                            {!hasActionColumn ? (
                                <>
                                    <col style={{ width: "10%" }} />
                                    <col style={{ width: "70%" }} />
                                    <col style={{ width: "20%" }} />
                                </>
                            ) : (
                                <>
                                    <col style={{ width: "10%" }} />
                                    <col style={{ width: "60%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "10%" }} />
                                </>
                            )}
                        </colgroup>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            hasActionColumn={hasActionColumn}
                        />
                        <TableBody>
                            {prepareFsObjects(files).map((file, i) => {
                                const labelId = `enhanced-table-${file["_id"]}`
                                const entityName = getEntityName(file["_type"])
                                const fileCreatedAt = file.createdAt ? timestampToString2(file.createdAt) : ""

                                return (
                                    <CustomTableRow hover onClick={event => handleClick(event, file)} key={file["_id"]}>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="default"
                                            className={classes.cell}
                                        >
                                            <FileIcon file={file} />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            className={classes.textCell}
                                            scope="row"
                                            padding="default"
                                        >
                                            {file.name}
                                        </TableCell>
                                        <TableCell align="right">{fileCreatedAt}</TableCell>
                                        {hasActionColumn && (
                                            <TableCell onClick={e => e.stopPropagation()} align="right">
                                                <IconButton
                                                    aria-label={"show options"}
                                                    aria-haspopup={true}
                                                    onClick={e => handleOptionsClick(e, i)}
                                                    size="small"
                                                    style={{ fontSize: "90%", outline: "none" }}
                                                >
                                                    <MdMoreVert className={classes.actionsButton} />
                                                </IconButton>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEls[i]}
                                                    keepMounted
                                                    open={Boolean(anchorEls[i])}
                                                    onClose={e => handleOptionsClose(e, i, file)}
                                                    getContentAnchorEl={null}
                                                    anchorOrigin={{
                                                        vertical: "bottom",
                                                        horizontal: "center",
                                                    }}
                                                    transformOrigin={{
                                                        vertical: "top",
                                                        horizontal: "center",
                                                    }}
                                                >
                                                    {/*<MenuItem*/}
                                                    {/*    // onClick={e => handleOptionsClose(e, i, file, "relocate")}*/}
                                                    {/*>*/}
                                                    {/*    <CustomListItemIcon>*/}
                                                    {/*        <MdContentCut />*/}
                                                    {/*    </CustomListItemIcon>*/}
                                                    {/*    Cut*/}
                                                    {/*</MenuItem>*/}
                                                    {entityName === DocumentEnums.folder.entityName && (
                                                        <div key={labelId}>
                                                            <MenuItem
                                                                onClick={e =>
                                                                    handleOptionsClose(e, i, file, "folder edit")
                                                                }
                                                            >
                                                                <CustomListItemIcon>
                                                                    <MdEdit />
                                                                </CustomListItemIcon>
                                                                Edit
                                                            </MenuItem>
                                                        </div>
                                                    )}
                                                </Menu>
                                            </TableCell>
                                        )}
                                    </CustomTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

const mapStateToProps = ({ clipboardReducer }) => {
    return {
        clipboard: { ...clipboardReducer },
    }
}

export default withRouter(connect(mapStateToProps, {})(FileExplorer))
