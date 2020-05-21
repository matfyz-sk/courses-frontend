import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table } from 'reactstrap'
import PointsModal from '../PointsModal'
import CriteriaModal from '../CriteriaModal'
import ResultTypeModal from '../ResultTypeModal'
import { RESULT_TYPE, RESULT_USER } from '../../../constants/routes';
import { redirect } from '../../../constants/redirect'
import { getShortID } from '../../../helperFunctions'

const ResultsInstructor = props => {
  const { courseInstance } = props
  return (
    <Container>
      <h1 className="mb-5">Course result</h1>
      <Row>
        <Col lg={6} md={6} sm={12} className="order-md-1 order-sm-2 mt-md-0 mt-4">
          <h2 className="mb-4">Students preview</h2>
          <Table hover size="sm" responsive>
            <thead>
              <tr>
                <th>Full name</th>
                <th>Points</th>
                <th>Grading</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Patrik Hudák (Patrick) </td>
                <td>24 b</td>
                <td>E</td>
                <td className="text-right">
                  <PointsModal user={null} />
                  {courseInstance ? (
                    <Link
                      to={redirect(RESULT_USER, [
                        {
                          key: 'course_id',
                          value: getShortID(courseInstance['@id']),
                        },
                        { key: 'user_id', value: 'ddd' },
                      ])}
                      className="btn btn-sm btn-link ml-2"
                    >
                      Profile
                    </Link>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg={6} md={6} sm={12} className="order-md-2 order-sm-1">
          <h2 className="mb-4">Result types</h2>
          <ResultTypeModal />
          <Table hover size="sm" responsive>
            <thead>
              <tr className="border-bottom">
                <th>Name</th>
                <th>Correction for</th>
                <th>Min points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-bottom">
                <th>Correction Midterm</th>
                <td>Midterm</td>
                <td>24</td>
                <td className="text-right">
                  <ResultTypeModal resultType={'x'} />
                  {courseInstance ? (
                    <Link
                      to={redirect(RESULT_TYPE, [
                        {
                          key: 'course_id',
                          value: getShortID(courseInstance['@id']),
                        },
                        { key: 'result_type', value: 'ddd' },
                      ])}
                      className="btn btn-sm btn-link ml-2"
                    >
                      Points
                    </Link>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table>

          <h2 className="mb-4 mt-4">Course grading</h2>
          <CriteriaModal />
          <Table hover size="sm" responsive>
            <tbody>
              <tr className="border-bottom">
                <th>0 - 25 b</th>
                <th>Fx</th>
                <td className="text-right">
                  <CriteriaModal grading={'x'} />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  const { courseInstance } = courseInstanceReducer
  return {
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(ResultsInstructor))
