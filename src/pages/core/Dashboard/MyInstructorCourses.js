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
import { useGetCourseQuery } from "services/course"

const MyInstructorCourses = props => {
  const {data, isSuccess } = useGetCourseQuery({instructorId: getUserID()}) 

  console.log(data)
  console.log(isSuccess)
  if (!isSuccess || !data || data.length === 0) {
    return null
  }

  const renderList = []
  data.forEach(item => {
    renderList.push(
      <ListGroupItem key={`instructorOf${item['_id']}`}>
        <ListGroupItemHeading>{item.name}</ListGroupItemHeading>
        <ListGroupItemText>
          {`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
        </ListGroupItemText>
        <Link
          to={redirect(TIMELINE, [
            { key: 'course_id', value: getShortID(item['_id']) },
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
      <h2 className="h4 mb-4">I am instructor of</h2>
      <ListGroup>{renderList}</ListGroup>
    </>
  )
}

export default MyInstructorCourses
