import React from 'react'
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
import { BASE_URL, COURSE_INSTANCE_URL, INITIAL_INFO_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { NOT_FOUND } from '../../../constants/routes'
import { getDisplayDateTime } from '../Helper'

class InfoPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...INITIAL_INFO_STATE,
      redirectTo: null,
      loading: true,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL}${COURSE_INSTANCE_URL}/${params.course_id}?_join=instanceOf,covers,hasInstructor`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
      if (data != null && data !== []) {
        this.setState({
          name: data[0].instanceOf[0].name,
          description: data[0].instanceOf[0].description,
          abbreviation: data[0].instanceOf[0].abbreviation,
          prerequisites: data[0].instanceOf[0].hasPrerequisite
            ? data[0].instanceOf[0].hasPrerequisite.map(prerequisite => {
                return { fullId: prerequisite['@id'], name: prerequisite.name }
              })
            : [],
          startDate: new Date(data[0].startDate),
          endDate: new Date(data[0].endDate),
          instructors: data[0].hasInstructor
            ? data[0].hasInstructor.map(i => {
                return {
                  fullId: i['@id'],
                  name: `${i.firstName} ${i.lastName}`,
                }
              })
            : [],
        })
      } else {
        this.setState({
          redirectTo: NOT_FOUND,
        })
      }
    })
  }

  render() {
    const {
      name,
      description,
      abbreviation,
      instructors,
      prerequisites,
      startDate,
      endDate,
      redirectTo,
      loading,
    } = this.state

    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }

    if (loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
    }

    return (
      <div>
        <Container className="container-view">
          <Card className="event-card">
            <CardHeader className="course-card-header">
              <span className="course-card-name">{name}</span>
            </CardHeader>
            <CardBody>
              <div className="event-dates-container">
                <div className="event-dates-col">
                  <CardSubtitle className="event-card-subtitle-double">
                    <div className="event-subtitle-double">From</div>
                    {getDisplayDateTime(startDate, true)}
                  </CardSubtitle>
                </div>
                <div className="event-dates-col">
                  <CardSubtitle className="event-card-subtitle-double">
                    <div className="event-subtitle-double">To</div>
                    {getDisplayDateTime(endDate, true)}
                  </CardSubtitle>
                </div>
              </div>

              <CardSubtitle className="event-card-subtitle">
                Abbreviation
              </CardSubtitle>
              <div className="fake-table">{abbreviation}</div>

              <CardSubtitle className="event-card-subtitle">
                Description
              </CardSubtitle>
              <div className="fake-table">{description}</div>

              {prerequisites.length > 0 && (
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
                      {prerequisites.map(prerequisite => (
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

              {instructors.length > 0 && (
                <>
                  <CardSubtitle className="event-card-subtitle">
                    Instructors
                  </CardSubtitle>
                  <Table responsive key="instructors" className="course-tables">
                    <tbody>
                      {instructors.map(instructor => (
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
}

export default InfoPage
