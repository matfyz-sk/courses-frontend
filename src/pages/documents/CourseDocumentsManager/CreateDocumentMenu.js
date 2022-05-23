import React from 'react'
import { withRouter } from 'react-router'
import { Button, ListItemIcon, Menu, MenuItem } from '@material-ui/core'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { MdAttachFile, MdCode, MdFolder, MdLink } from 'react-icons/md'
import { ThemeProvider, withStyles } from '@material-ui/styles'
import { customTheme } from '../styles'

const CustomListItemIcon = withStyles({
  root: {
    minWidth: '30px',
    color: customTheme.palette.primary.main,
  },
})(ListItemIcon)

function CreateDocumentMenu({ onFolderCreate, loading, match, history }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const courseId = match.params.course_id

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = path => {
    setAnchorEl(null)
    history.push(path)
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Button
        style={{ outline: 'none' }}
        variant="contained"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
        disabled={loading}
      >
        CREATE
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            onFolderCreate()
          }}
        >
          <CustomListItemIcon>
            <MdFolder />
          </CustomListItemIcon>
          Folder
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose(
              redirect(ROUTES.CREATE_INTERNAL_DOCUMENT, [
                { key: 'course_id', value: courseId },
              ])
            )
          }
        >
          <CustomListItemIcon>
            <MdCode />
          </CustomListItemIcon>
          Internal
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose(
              redirect(ROUTES.CREATE_EXTERNAL_DOCUMENT, [
                { key: 'course_id', value: courseId },
              ])
            )
          }
        >
          <CustomListItemIcon>
            <MdLink />
          </CustomListItemIcon>
          External
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose(
              redirect(ROUTES.CREATE_FILE_DOCUMENT, [
                { key: 'course_id', value: courseId },
              ])
            )
          }
        >
          <CustomListItemIcon>
            <MdAttachFile />
          </CustomListItemIcon>
          File
        </MenuItem>
      </Menu>
    </ThemeProvider>
  )
}

export default withRouter(CreateDocumentMenu)
