import React from 'react'
import { Breadcrumbs, Typography } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import { getShortID } from 'helperFunctions'
import { makeStyles } from '@material-ui/core/node_modules/@material-ui/styles'

const useStyles = makeStyles({
  root: {
    color: '#237a23',
    fontStyle: 'italic',
  },
})

function Path(props) {
  const classes = useStyles()
  const {fsPath, onPathFolderClickHandler} = props
  return (
    <div>
      <Breadcrumbs style={{display: "block"}} aria-label="breadcrumb">
        {fsPath.map((folder, i) =>
          i !== fsPath.length - 1 ? (
            <Link
              key={i}
              className={classes.root}
              onClick={() => onPathFolderClickHandler(getShortID(folder['@id']))}
              to={{}}
            >
              {folder.name}
            </Link>
          ) : (
            <Typography key={i} color="textPrimary">
              {folder.name}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  )
}

export default withRouter(Path)
