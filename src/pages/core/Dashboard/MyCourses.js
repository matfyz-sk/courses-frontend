import React from 'react'
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { getUserID } from '../../../components/Auth'
import { formatDate } from '../../../functions/global'
import { redirect } from '../../../constants/redirect'
import { TIMELINE } from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import { useGetUserStudentOfQuery } from "services/user"

const MyCourses = props => {
  const {data, isSuccess } = useGetUserStudentOfQuery(getUserID())

  if(!isSuccess || !data || data.length === 0) {
    return null
  }

  const renderList = []
  data[0].studendOf.forEach(item => {
    renderList.push(
      <ListGroupItem key={`myCourses${item['@id']}`}>
        <ListGroupItemHeading>{item.name}</ListGroupItemHeading>
        <ListGroupItemText>
          {`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
        </ListGroupItemText>
        <Link
          to={redirect(TIMELINE, [
            { key: 'course_id', value: getShortID(item['@id']) },
          ])}
          className="btn btn-sm btn-link float-right text-primary"
        >
          Detail
        </Link>
      </ListGroupItem>
    )
  })
  return (
    <>
      <h2 className="h4 mb-4">My courses</h2>
      <ListGroup>{renderList}</ListGroup>
    </>
  )
}

export default MyCourses
