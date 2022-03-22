import React, { useEffect, useState } from 'react'
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { authHeader, getUserID } from '../../../components/Auth'
import { formatDate } from '../../../functions/global'
import { redirect } from '../../../constants/redirect'
import { TIMELINE } from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import { BACKEND_URL } from "../../../constants";

const MyInstructorCourses = props => {
  const [data, setData] = useState(null)
  function getData() {
    fetch(`${BACKEND_URL}/data/courseInstance?hasInstructor=${getUserID()}`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(_data => {
        if (_data['@graph'].length > 0) {
          setData(_data['@graph'])
        }
      })
  }

  useEffect(() => {
    getData()
  }, [])

  if (!data || data.length === 0) {
    return null
  }

  const renderList = []
  data.forEach(item => {
    renderList.push(
      <ListGroupItem key={`instructorOf${item['@id']}`}>
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
      <h2 className="h4 mb-4">I am instructor of</h2>
      <ListGroup>{renderList}</ListGroup>
    </>
  )
}

export default MyInstructorCourses
