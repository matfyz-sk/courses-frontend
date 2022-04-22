import { useState } from 'react'
import {
  IconButton,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
} from '@material-ui/core'
import { timestampToString2, getShortType } from 'helperFunctions'
import { withRouter } from 'react-router'
import {
  MdDelete,
  MdRestorePage,
  MdEdit
} from 'react-icons/md'
import Path from './Path'
import { DocumentEnums } from '../enums/document-enums'
import { useFileExplorerStyles } from '../styles/styles'
import FileIcon from '../common/FileIcon'

const CustomTableRow = withStyles({
  root: {
    '&$hover:hover': {
      backgroundColor: 'x',
      cursor: 'pointer',
    },
  },
  selected: {},
  hover: {},
})(TableRow)

function descendingComparator(a, b, orderBy) {
  if (orderBy === '@type') {
    const aEntityName = getShortType(a['@type'])
    const bEntityName = getShortType(b['@type'])
    if (
      bEntityName !== DocumentEnums.folder.entityName &&
      aEntityName === DocumentEnums.folder.entityName
    )
      return -1
    if (
      bEntityName === DocumentEnums.folder.entityName &&
      aEntityName !== DocumentEnums.folder.entityName
    )
      return 1
    return 0
  }

  const x = orderBy === 'createdAt' ? new Date(b[orderBy]) : b[orderBy]
  const y = orderBy === 'createdAt' ? new Date(a[orderBy]) : a[orderBy]
  if (x < y) {
    return -1
  }
  if (x > y) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
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

const headCells = [
  {
    id: 'type',
    disableSort: true,
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Last changed',
  },
  {
    //TODO remove
    id: 'actionsButton',
    disableSort: true,
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isReferencer } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead style={{ position: 'static' }}>
      <TableRow style={{ position: 'static' }}>
        {headCells.slice(...(isReferencer ? [0, -1] : [0])).map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {!headCell.disableSort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}


function FileExplorer(props) {
  const {
    files,
    showingDeleted,
    invertDeletionFlag,
    search,
    fsPath,
    onRowClickHandler,
    onPathFolderClickHandler,
    isReferencer,
    editFolder
  } = props

  const classes = useFileExplorerStyles()
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('createdAt')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const handleClick = (event, fsObject) => {
    onRowClickHandler(event, fsObject)
  }

  const filterSearched = toBeSearched => {
    if (!search) return toBeSearched
    return toBeSearched.filter(
      f =>
        f.name.includes(search) ||
        timestampToString2(f.createdAt).includes(search)
    )
  }

  const lastChangedSwap = files => {
    // folder specific because createdAt attr updated in db
    const newFiles = files.map(file => {
        if (file.lastChanged) {
          return {...file, createdAt: file.lastChanged }
        }
        return file
      }
    )
    return newFiles
  }

  return (
    <div className={classes.root}>
      <Paper elevation={4} className={classes.paper}>
        <TableContainer>
          <Toolbar>
            <Path 
              fsPath={fsPath}
              onPathFolderClickHandler={onPathFolderClickHandler}
             />
          </Toolbar>
          <Table
            size="small"
            aria-label="file explorer table"
            stickyHeader
          >
            <colgroup>
              {isReferencer ? (
                <>
                  <col style={{width: "10%"}}/>
                  <col style={{width: "70%"}}/>
                  <col style={{width: "20%"}}/>
                </>
              )
              : (
                <>
                  <col style={{width: "10%"}}/>
                  <col style={{width: "60%"}}/>
                  <col style={{width: "20%"}}/>
                  <col style={{width: "10%"}}/>
                </>
              )}
              
            </colgroup>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={files.length}
              isReferencer={isReferencer}
            />
            <TableBody>
              {stableSort(
                stableSort(
                  filterSearched(lastChangedSwap(files)),
                  getComparator(order, orderBy)
                ),
                getComparator('desc', '@type')
              ).map((file, index) => {
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <CustomTableRow
                    hover
                    onClick={event => handleClick(event, file)}
                    key={file["@id"]}
                  >
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
                    <TableCell align="right">
                      {timestampToString2(file.createdAt)}
                    </TableCell>
                    {!isReferencer && (
                      <TableCell onClick={e => e.stopPropagation()} align="right">
                        
                        {getShortType(file['@type']) === DocumentEnums.folder.entityName && (
                          <IconButton
                            aria-label={"edit folder"}
                            onClick={(e) => editFolder(file)}
                            size="small"
                            style={{fontSize: "90%", outline: "none"}}                        
                          >
                            <MdEdit className={classes.actionsButton} />
                          </IconButton>
                        )}
                        
                        <IconButton
                          aria-label={showingDeleted ? "delele item" : "restore item"}
                          onClick={() => invertDeletionFlag(file)}
                          size="small"
                          style={{fontSize: "90%", outline: "none"}}                        
                        >
                          {showingDeleted ? (
                            <MdRestorePage className={classes.actionsButton} />
                          ) : (
                            <MdDelete className={classes.actionsButton} />
                          )}
                        </IconButton>
                        
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

export default withRouter(FileExplorer)
