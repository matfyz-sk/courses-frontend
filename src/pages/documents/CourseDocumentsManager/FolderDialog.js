import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'

function FolderDialog({
  isEdit,
  open,
  handleClose,
  folderName,
  setFolderName,
  onCreate,
  onEdit,
}) {
  const onSubmit = e => {
    if (folderName.length !== 0) {
      isEdit ? onEdit() : onCreate()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="folder-form-dialog"
      >
        <DialogTitle id="folder-form-title">
          {isEdit ? 'Edit' : 'Create'} folder
        </DialogTitle>
        <DialogContent>
          {/* TODO resolve tip */}
          <DialogContentText>
            Beware! A folder can be deleted only if it's empty
          </DialogContentText>
          <TextField
            error={folderName.length === 0}
            autoFocus
            margin="dense"
            variant="outlined"
            id="name"
            label="folder name"
            type="text"
            fullWidth
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            helperText={folderName.length === 0 ? 'Name is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            style={{ outline: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            color="primary"
            style={{ outline: 'none' }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FolderDialog
