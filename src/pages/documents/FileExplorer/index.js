import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import { timestampToString2, getShortType } from 'helperFunctions'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core'
import {
  MdDelete,
  MdRestorePage,
  MdFolder,
  MdCode,
  MdLink,
  MdAttachFile,
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import Path from './Path'
import { DocumentEnums } from '../enums/document-enums'
import { useFileExplorerStyles } from '../styles/styles'

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
    id: 'actions',
    disableSort: true,
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  cell: {
    padding: '6px 2px 6px 12px',
  },
  textCell: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  }
}))

const FileExplorerIcon = ({ entityName }) => {
  const classes = useFileExplorerStyles()

  const entityToIcon = {
    [DocumentEnums.internalDocument.entityName]: (
      <MdCode className={classes.info} />
    ),
    [DocumentEnums.folder.entityName]: <MdFolder className={classes.info} />,
    [DocumentEnums.externalDocument.entityName]: (
      <MdLink className={classes.info} />
    ),
    [DocumentEnums.file.entityName]: <MdAttachFile className={classes.info} />,
  }

  return (
    <>
      {/* TODO add material icon this way */}
      {/* {entityName === DocumentEnums.externalDocument.entityName && (entityToIcon[entityName])} */}
      {entityToIcon[entityName]}
    </>
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
  } = props

  const classes = useStyles()
  const iconClasses = useFileExplorerStyles()
  const [order, setOrder] = useState('asc')
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Toolbar>
            <Path 
              fsPath={fsPath}
              onPathFolderClickHandler={onPathFolderClickHandler}
             />
          </Toolbar>
          <Table
            className={classes.table}
            aria-labelledby="Files table"
            size="small"
            aria-label="table"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={files.length}
            />
            <TableBody>
              {stableSort(
                stableSort(
                  filterSearched(files),
                  getComparator(order, orderBy)
                ),
                getComparator('desc', '@type')
              ).map((file, index) => {
                const labelId = `enhanced-table-checkbox-${index}`
                const entityName = getShortType(file['@type'])

                return (
                  <CustomTableRow
                    hover
                    onClick={event => handleClick(event, file)}
                    tabIndex={-1}
                    key={file.name}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="default"
                      className={classes.cell}
                    >
                      <FileExplorerIcon entityName={entityName} />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      // TODO wrap or no wrap
                      className={classes.textCell}
                      scope="row"
                      padding="default"
                    >
                      {file.name}
                    </TableCell>
                    <TableCell align="right">
                      {timestampToString2(file.createdAt)}
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()} align="right">
                      {/* TODO condition */}
                      <Link to={{}} onClick={() => invertDeletionFlag(file)}>
                        {showingDeleted ? (
                          <MdRestorePage className={iconClasses.actions} />
                        ) : (
                          <MdDelete className={iconClasses.actions} />
                        )}
                      </Link>
                    </TableCell>
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
