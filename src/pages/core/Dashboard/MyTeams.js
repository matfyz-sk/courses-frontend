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
import { useGetTeamInstanceWithUsersQuery, useGetTeamDetailsQuery } from 'services/team'

function MyTeams(props) {
  const [data, setData] = useState(null)

  const {
    data: teamInstanceData, 
    isSuccess: teamInstanceIsSuccess
  } = useGetTeamInstanceWithUsersQuery(getUserID())
  if(data !== null && teamInstanceIsSuccess && teamInstanceData) {
    if(teamInstanceData.length > 0) {
      const newData = []
      for (const detail of teamInstanceData) {
        if (detail?.instanceOf && detail?.instanceOf.length > 0) {
          const {
            data: teamData, 
            isSuccess: teamIsSucces
          } = useGetTeamDetailsQuery(getShortID(
            detail.instanceOf[0]['@id']
          ))
    
          if(teamIsSucces && teamData) {
            if(teamData.length > 0 && teamData[0].courseInstance.length > 0) {
              newData.push({
                teamInstance: detail,
                team: teamData[0],
              })
            }
          }
        }
      }
      setData(newData)
    } else {
      setData(teamInstanceData)
    }
  }
/*
  const fetchTeamDetail = (fetched_data, index = 0) => {
    const detail = fetched_data[index]
    // ? the ?. seems to have fixed this typeerror here, not sure if this is the right way...
    if (detail?.instanceOf && detail?.instanceOf.length > 0) {
      const {data, isSuccess} = useGetTeamDetailsQuery(getShortID(
        detail.instanceOf[0]['@id']
      ))

      if(isSuccess && data) {
        if(data.length > 0 && data[0].courseInstance.length > 0) {
          const newData = []
          newData.push({
            teamInstance: detail,
            team: data[0],
          })
          setData(newData)
        }
        if (fetched_data.length > index) {
          fetchTeamDetail(fetched_data, index + 1)
        }
      }
    }
  }

  useEffect(() => {
    
  }, [])*/

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
