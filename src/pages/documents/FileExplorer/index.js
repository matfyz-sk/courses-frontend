import React, { useState } from 'react'
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
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  withStyles,
} from '@material-ui/core'
import { getShortType, timestampToString2 } from '../../../helperFunctions'
import { withRouter } from 'react-router'
import {
  MdContentCut,
  MdContentPaste,
  MdEdit,
  MdMoreVert,
} from 'react-icons/md'
import Path from './Path'
import { DocumentEnums } from '../common/enums/document-enums'
import { customTheme, useFileExplorerStyles } from '../styles'
import FileIcon from '../common/FileIcon'
import { connect } from 'react-redux'

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
  if (orderBy === '_type') {
    const aEntityName = getShortType(a['_type'])
    const bEntityName = getShortType(b['_type'])
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
    id: 'actionsButton',
    disableSort: true,
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
]

function EnhancedTableHead({
  classes,
  order,
  orderBy,
  onRequestSort,
  hasActionColumn,
}) {
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  const prepareHeadCells = headCells => {
    if (!hasActionColumn) return headCells.slice(0, -1)
    return headCells
  }

  return (
    <TableHead style={{ position: 'static' }}>
      <TableRow style={{ position: 'static' }}>
        {prepareHeadCells(headCells).map(headCell => (
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

const CustomListItemIcon = withStyles({
  root: {
    minWidth: '30px',
    color: customTheme.palette.primary.main,
  },
})(ListItemIcon)

function FileExplorer({
  files,
  search,
  fsPath,
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
  const currentFolder = fsPath?.[fsPath?.length - 1] ?? {}
  const [anchorEls, setAnchorEls] = React.useState([])
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('createdAt')

  const handleOptionsClick = (event, i) => {
    let newAnchorEls = anchorEls.slice()
    newAnchorEls[i] = event.currentTarget
    setAnchorEls(newAnchorEls)
  }

  const handleOptionsClose = (event, i, file, additionalAction = '') => {
    let newAnchorEls = anchorEls.slice()
    newAnchorEls[i] = null
    setAnchorEls(newAnchorEls)
    switch (additionalAction) {
      case 'folder edit':
        editFolder(file)
        break
      case 'relocate':
        onCut(file)
        break
      default:
        break
    }
  }

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
    return files.map(file => {
      if (file.lastChanged) {
        return { ...file, createdAt: file.lastChanged }
      }
      return file
    })
  }

  const filterToBeCut = files => {
    if (isRelocator && clipboard.beingCut) {
      return files.filter(file => file['_id'] !== clipboard.beingCut['_id'])
    }
    return files
  }

  const prepareFiles = files => {
    return stableSort(
      stableSort(
        filterSearched(lastChangedSwap(filterToBeCut(files))),
        getComparator(order, orderBy)
      ),
      getComparator('desc', '_type')
    )
  }

  return (
    <div className={classes.root}>
      <Paper elevation={4} className={classes.paper}>
        <TableContainer>
          <Toolbar>
            {isRelocator && (
              <IconButton
                aria-label={'show options'}
                aria-haspopup={true}
                onClick={e => onPaste(e, currentFolder)}
                size="small"
                style={{ fontSize: '90%', outline: 'none', marginLeft: 'auto' }}
              >
                <MdContentPaste className={classes.actionsButton} />
              </IconButton>
            )}
          </Toolbar>
          <Table size="small" aria-label="file explorer table" stickyHeader>
            <colgroup>
              {!hasActionColumn ? (
                <>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '70%' }} />
                  <col style={{ width: '20%' }} />
                </>
              ) : (
                <>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '60%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '10%' }} />
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
              {prepareFiles(files).map((file, i) => {
                const labelId = `enhanced-table-${file['_id']}`
                const entityName = getShortType(file['_type'])

                return (
                  <CustomTableRow
                    hover
                    onClick={event => handleClick(event, file)}
                    key={file['_id']}
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
                    {hasActionColumn && (
                      <TableCell
                        onClick={e => e.stopPropagation()}
                        align="right"
                      >
                        <IconButton
                          aria-label={'show options'}
                          aria-haspopup={true}
                          onClick={e => handleOptionsClick(e, i)}
                          size="small"
                          style={{ fontSize: '90%', outline: 'none' }}
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
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <MenuItem
                            onClick={e =>
                              handleOptionsClose(e, i, file, 'relocate')
                            }
                          >
                            <CustomListItemIcon>
                              <MdContentCut />
                            </CustomListItemIcon>
                            Cut
                          </MenuItem>
                          {entityName === DocumentEnums.folder.entityName && (
                            <div key={labelId}>
                              <MenuItem
                                onClick={e =>
                                  handleOptionsClose(e, i, file, 'folder edit')
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

const mapStateToProps = ({clipboardReducer}) => {
  return {
    clipboard: {...clipboardReducer}
  }
}

export default withRouter(
  connect(mapStateToProps, {})(
    FileExplorer
  )
)
