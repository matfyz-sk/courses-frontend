import React from 'react'
import { MdDelete } from 'react-icons/md'
import { CustomCloseIconButton } from './styles'
import { useNewQuizStyles } from './styles'

function ImagePreview({ src, handleDelete }) {
  const classes = useNewQuizStyles()
  return (
    <div className={classes.imagePreviewDiv}>
      <img src={src} alt={''} style={{ maxWidth: '100%' }} />
      <CustomCloseIconButton
        className="closeButton"
        aria-label="remove image"
        onClick={handleDelete}
      >
        <MdDelete />
      </CustomCloseIconButton>
    </div>
  )
}

export default ImagePreview
