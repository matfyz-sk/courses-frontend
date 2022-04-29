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

const MyCourses = props => {
  const [data, setData] = useState(null)
  function getData() {
    fetch(`${BACKEND_URL}data/user/${getUserID()}?_join=studentOf`, {
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
          setData(_data['@graph'][0].studentOf)
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
