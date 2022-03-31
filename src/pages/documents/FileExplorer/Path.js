import React from 'react'
import { Breadcrumbs, Typography } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import * as ROUTES from '../../../constants/routes'
import { redirect } from '../../../constants/redirect'
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
  const { fsPath } = props
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {fsPath.length ? (
          <Link
            className={classes.root}
            to={redirect(ROUTES.DOCUMENTS, [
              { key: 'course_id', value: props.match.params.course_id },
            ])}
          >
            Home
          </Link>
        ) : (
          <Typography color="textPrimary">Home</Typography>
        )}
        {fsPath.map((folder, i) =>
          i !== fsPath.length - 1 ? (
            <Link
              key={i}
              className={classes.root}
              to={redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
                { key: 'course_id', value: props.match.params.course_id },
                { key: 'folder_id', value: getShortID(folder['@id']) },
              ])}
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
