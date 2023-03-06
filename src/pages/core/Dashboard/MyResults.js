import React from 'react'
import { Alert, Badge, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, } from 'reactstrap'
import { Link } from 'react-router-dom'
import { getUserID } from '../../../components/Auth'
import { redirect } from '../../../constants/redirect'
import { RESULT_DETAIL, RESULT_TYPE, TIMELINE } from '../../../constants/routes';
import { getShortID } from '../../../helperFunctions'
import { formatDate } from "../../../functions/global";
import { useGetResultForUserQuery } from  "services/result"

const MyResults = props => {
  const { data, isSuccess } = useGetResultForUserQuery(getUserID())
  
  if(!isSuccess || !data || data.length === 0) {
    return null
  }
  
  const orderedData = data.sort(function(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const renderList = []
  orderedData.forEach(item => {
    const course_link = (
      <Link
        to={ redirect(TIMELINE, [
          {
            key: 'course_id',
            value: getShortID(item.courseInstance[0]['@id']),
          },
        ]) }
      >
        { item.courseInstance[0].name }
      </Link>
    )

    const date = (
      <span className="float-left text-muted">{ formatDate(item.createdAt) }</span>
    )

    const result_link = (
      <Link
        to={ redirect(RESULT_DETAIL, [
          {
            key: 'course_id',
            value: getShortID(item.courseInstance[0]['@id']),
          },
          {
            key: 'result_id',
            value: getShortID(item['@id']),
          },
        ]) }
        className="btn btn-sm btn-link float-right text-primary"
      >
        Result detail
      </Link>
    )
    let result_type_link = null
    const hasResultType = item.type && item.type.length > 0
    if(hasResultType) {
      result_type_link = (
        <Link
          to={ redirect(RESULT_TYPE, [
            {
              key: 'course_id',
              value: getShortID(item.courseInstance[0]['@id']),
            },
            {
              key: 'result_type_id',
              value: getShortID(item.type[0]['@id']),
            },
          ]) }
        >
          { item.type[0].name }
        </Link>
      )
    }
    renderList.push(
      <ListGroupItem key={ `result-${ item['@id'] }` }>
        <ListGroupItemHeading>
          { result_type_link || 'Without type' } - { item.points } points
          <Badge
            color={
              hasResultType && item.type[0].minPoints > item.points
                ? 'success'
                : 'danger'
            }
            className="float-right"
          >
            { hasResultType && item.type[0].minPoints > item.points
              ? 'passed'
              : 'failed' }
          </Badge>
        </ListGroupItemHeading>
        <ListGroupItemText>in course { course_link }</ListGroupItemText>
        <ListGroupItemText className="mt-1">
          { date }
          { result_link }
        </ListGroupItemText>
      </ListGroupItem>
    )
  })

  return (
    <>
      <h2 className="h4 mb-4">My results</h2>
      { renderList.length === 0 ? (
        <Alert color="info">No results yet!</Alert>
      ) : (
        <div style={ {maxHeight: 380, overflowY: 'scroll'} } className="pr-1 pl-1 pb-1 mb-4">
          <ListGroup className="h4 mb-4">{ renderList }</ListGroup>
        </div>
      ) }
    </>
  )
}

export default MyResults
