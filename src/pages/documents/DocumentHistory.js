import React, { useState, useEffect, useCallback } from 'react'
import { Alert } from 'reactstrap'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { axiosGetEntities, getResponseBody } from 'helperFunctions'
import { redirect } from '../../constants/redirect'
import * as ROUTES from '../../constants/routes'

function DocumentHistory(props) {
  const [newestVersionId, setNewestVersionId] = useState(
    props.match.params.document_id
  )
  const [courseId, setCourseId] = useState(props.match.params.course_id)
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllVersions = useCallback(() => {
    setLoading(true)
    const url = `document/${newestVersionId}?_chain=previousVersion`
    axiosGetEntities(url).then(response => {
      if (response.failed) {
        console.error("There was a problem getting this document's history")
        setLoading(false)
        return // ? snackbar
      }
      const data = getResponseBody(response)
      if (data[0].isDeleted || data[0].nextVersion.length !== 0) {
        props.history.push(
          redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
        )
        return
      }
      setVersions(data)
      setLoading(false)
    })
  }, [newestVersionId, courseId])

  useEffect(() => {
    fetchAllVersions()    
  }, [fetchAllVersions])

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <div>
      <h1>Document version history</h1>
      <ul>
        {versions.map((version, i) => (
          <li key={i}>
            {version.name}, {version.createdAt}
          </li>
        ))}
      </ul>
    </div>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(DocumentHistory))
