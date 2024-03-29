import React, { useState } from 'react'
import {
  Container,
  Card,
  CardSubtitle,
  CardHeader,
  CardBody,
  Table,
  Alert,
} from 'reactstrap'
import { Redirect } from 'react-router'
import { INITIAL_INFO_STATE } from '../constants'
import { NOT_FOUND } from '../../../constants/routes'
import { getDisplayDateTime } from '../Helper'
import { useGetCourseInstanceQuery } from 'services/course'
import { getFullID } from "../../../helperFunctions";

function InfoPage(props) {
  const { match: { params } } = props
  const { data, isSuccess, isLoading } = useGetCourseInstanceQuery({id: getFullID(params.course_id, "courseInstance")})
  const [redirectTo, setRedirectTo] = useState(null)

  if (redirectTo) {
    return <Redirect to={redirectTo} />
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let info = INITIAL_INFO_STATE
  if (isSuccess && data && data.length > 0) {
    const courseInstance = data[0]
    info = {
      name: courseInstance.course.name,
      description: courseInstance.course.description,
      abbreviation: courseInstance.course.abbreviation,
      prerequisites: courseInstance.course.hasPrerequisite
        ? courseInstance.course.hasPrerequisite.map(prerequisite => {
            return { fullId: prerequisite['_id'], name: prerequisite.name }
          })
        : [],
      startDate: new Date(courseInstance.startDate.millis),
      endDate: new Date(courseInstance.endDate.millis),
      instructors: courseInstance.hasInstructor
        ? courseInstance.hasInstructor.map(i => {
            return {
              fullId: i['_id'],
              name: `${i.firstName} ${i.lastName}`,
            }
          })
        : [],
    }
  } else {
    setRedirectTo(NOT_FOUND)
  }

  return (
    <div>
      <Container className="container-view">
        <Card className="event-card">
          <CardHeader className="course-card-header">
            <span className="course-card-name">{info.name}</span>
          </CardHeader>
          <CardBody>
            <div className="event-dates-container">
              <div className="event-dates-col">
                <CardSubtitle className="event-card-subtitle-double">
                  <div className="event-subtitle-double">From</div>
                  {getDisplayDateTime(info.startDate, true)}
                </CardSubtitle>
              </div>
              <div className="event-dates-col">
                <CardSubtitle className="event-card-subtitle-double">
                  <div className="event-subtitle-double">To</div>
                  {getDisplayDateTime(info.endDate, true)}
                </CardSubtitle>
              </div>
            </div>
 
            <CardSubtitle className="event-card-subtitle">
              Abbreviation
            </CardSubtitle>
            <div className="fake-table">{info.abbreviation}</div>

            <CardSubtitle className="event-card-subtitle">
              Description
            </CardSubtitle>
            <div className="fake-table">{info.description}</div>

            {info.prerequisites.length > 0 && (
              <>
                <CardSubtitle className="event-card-subtitle">
                  Prerequisites
                </CardSubtitle>
                <Table
                  responsive
                  key="prerequisites"
                  className="course-tables"
                >
                  <tbody>
                    {info.prerequisites.map(prerequisite => (
                      <tr
                        key={`${prerequisite.id}tr`}
                        className="course-list-group-item"
                      >
                        <td className="material-name">{prerequisite.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}

            {info.instructors.length > 0 && (
              <>
                <CardSubtitle className="event-card-subtitle">
                  Instructors
                </CardSubtitle>
                <Table responsive key="instructors" className="course-tables">
                  <tbody>
                    {info.instructors.map(instructor => (
                      <tr
                        key={`${instructor.id}tr`}
                        className="course-list-group-item"
                      >
                        <td className="material-name">{instructor.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

export default InfoPage
