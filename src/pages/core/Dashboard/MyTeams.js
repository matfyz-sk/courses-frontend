import React, { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { getUserID } from '../../../components/Auth'
import { redirect } from '../../../constants/redirect'
import { COURSE_TEAM_DETAIL, TIMELINE}  from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import { useGetUserTeamInstanceAndTeamQuery } from 'services/user'

function MyTeams(props) {
  const [data, setData] = useState(null)
  const {data: requestedData, isSuccess: isSuccessRequestedData} = useGetUserTeamInstanceAndTeamQuery(getUserID())

  if (data !== null && isSuccessRequestedData && requestedData && requestedData.length > 0) {
    if(requestedData[0].memberOf.length > 0) {
      const newData = []
      for (const detail of requestedData.memberOf) {
        if (detail?.instanceOf && detail?.instanceOf.length > 0 && detail?.instanceOf.courseInstance.length > 0) {
          newData.push({
            teamInstance: detail,
            team: detail.instanceOf,
          })
        }
      }
    } else {
      setData(requestedData.memberOf)
    }
  }

  if (data === null) {
    return null
  }

  const renderList = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const course_link = (
      <Link
        to={redirect(TIMELINE, [
          {
            key: 'course_id',
            value: getShortID(item.team.courseInstance[0]['@id']),
          },
        ])}
      >
        {item.team.courseInstance[0].name}
      </Link>
    )
    renderList.push(
      <ListGroupItem key={`team${item.teamInstance['@id']}`}>
        <ListGroupItemHeading>
          {item.team.name}
          <Badge
            color={item.teamInstance.approved ? 'success' : 'danger'}
            className="float-right"
          >
            {item.teamInstance.approved ? 'approved' : 'not approved'}
          </Badge>
        </ListGroupItemHeading>
        <ListGroupItemText>Team of course {course_link}</ListGroupItemText>
        <Link
          to={redirect(COURSE_TEAM_DETAIL, [
            {
              key: 'course_id',
              value: getShortID(item.team.courseInstance[0]['@id']),
            },
            {
              key: 'team_id',
              value: getShortID(item.team['@id']),
            },
          ])}
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
      {renderList.length === 0 ? (
        <Alert color="info">No teams yet!</Alert>
      ) : (
        <ListGroup>{renderList}</ListGroup>
      )}
    </>
  )
}

export default MyTeams
