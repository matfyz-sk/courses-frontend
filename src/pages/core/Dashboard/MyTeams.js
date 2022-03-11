import React, { useEffect, useState } from 'react'
import { Alert, Badge, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, } from 'reactstrap'
import { Link } from 'react-router-dom'
import { authHeader, getUserID } from '../../../components/Auth'
import { redirect } from '../../../constants/redirect'
import { COURSE_TEAM_DETAIL, TIMELINE } from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import { BACKEND_URL } from "../../../constants";

const MyTeams = props => {
  const [ data, setData ] = useState(null)

  function fetchTeamDetail(fetched_data, index = 0) {
    const detail = fetched_data[index]
    if(detail.instanceOf && detail.instanceOf.length > 0) {
      fetch(
        `${ BACKEND_URL }/data/team/${ getShortID(
          detail.instanceOf[0]['@id']
        ) }?_join=courseInstance`,
        {
          method: 'GET',
          headers: authHeader(),
          mode: 'cors',
          credentials: 'omit',
        }
      )
        .then(response => {
          if(!response.ok) throw new Error(response)
          else return response.json()
        })
        .then(_data => {
          if(
            _data['@graph'].length > 0 &&
            _data['@graph'][0].courseInstance.length > 0
          ) {
            const newData = []
            newData.push({
              teamInstance: detail,
              team: _data['@graph'][0],
            })
            setData(newData)
          }
          if(fetched_data.length > index) {
            fetchTeamDetail(fetched_data, index + 1)
          }
        })
    }
  }

  function getData() {
    fetch(`${ BACKEND_URL }/data/teamInstance?hasUser=${ getUserID() }`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(_data => {
        if(_data['@graph'].length > 0) {
          fetchTeamDetail(_data['@graph'])
        } else {
          setData(_data['@graph'])
        }
      })
  }

  useEffect(() => {
    getData()
  }, [])

  if(data === null) {
    return null
  }

  const renderList = []
  for(let i = 0; i < data.length; i++) {
    const item = data[i]
    const course_link = (
      <Link
        to={ redirect(TIMELINE, [
          {
            key: 'course_id',
            value: getShortID(item.team.courseInstance[0]['@id']),
          },
        ]) }
      >
        { item.team.courseInstance[0].name }
      </Link>
    )
    renderList.push(
      <ListGroupItem key={ `team${ item.teamInstance['@id'] }` }>
        <ListGroupItemHeading>
          { item.team.name }
          <Badge
            color={ item.teamInstance.approved ? 'success' : 'danger' }
            className="float-right"
          >
            { item.teamInstance.approved ? 'approved' : 'not approved' }
          </Badge>
        </ListGroupItemHeading>
        <ListGroupItemText>Team of course { course_link }</ListGroupItemText>
        <Link
          to={ redirect(COURSE_TEAM_DETAIL, [
            {
              key: 'course_id',
              value: getShortID(item.team.courseInstance[0]['@id']),
            },
            {
              key: 'team_id',
              value: getShortID(item.team['@id']),
            },
          ]) }
          className="btn btn-sm btn-link float-right text-primary"
        >
          Team detail
        </Link>
      </ListGroupItem>
    )
  }

  return (
    <>
      <h2 className="h4 mb-4">My teams</h2>
      { renderList.length === 0 ? (
        <Alert color="info">No teams yet!</Alert>
      ) : (
        <ListGroup>{ renderList }</ListGroup>
      ) }
    </>
  )
}

export default MyTeams
