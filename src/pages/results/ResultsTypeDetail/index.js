import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table, FormGroup, Input } from 'reactstrap'

const ResultsTypeDetail = props => {
  const { privileges } = props
  const canEdit = privileges.inGlobal === 'admin' || privileges.inCourseInstance === 'instructor'
  return (
    <Container>
      <h1 className="mb-2">Results of Midterm 2</h1>
      <h3 className="text-muted mb-4">Correction for Midterm</h3>
      <Row>
        <Col sm={12} className="mt-4">
          <Table hover size="sm" responsive>
            <thead>
              <tr>
                <th>Student</th>
                <th>Minimum points</th>
                <th>Previous points</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>dsdssd</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>
                  {!canEdit ? (
                    <FormGroup className="m-0">
                      <Input type="number" name="points" placeholder="set points" />
                    </FormGroup>
                  ) : (
                    <>mmm</>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ courseInstanceReducer, privilegesReducer }) => {
  const { courseInstance } = courseInstanceReducer
  const privileges = privilegesReducer
  return {
    courseInstance,
    privileges,
  }
}

export default withRouter(connect(mapStateToProps)(ResultsTypeDetail))
