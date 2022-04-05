import React from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

function FolderDialog({
  isEdit,
  open,
  handleClose,
  folderName,
  setFolderName,
  submitHandler,
}) {

  const onSubmit = (e) => {
    if (folderName.length !== 0)
      submitHandler(e)
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FolderDialog
