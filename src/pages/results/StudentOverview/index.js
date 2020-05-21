import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table, Alert } from 'reactstrap'

const StudentOverview = () => {
  return (
    <Container>
      <h1 className="mb-5">My results</h1>
      <Row>
        <Col lg={9} md={8} sm={12} className="order-md-1 order-sm-2  mt-md-0 mt-4">
          <h2 className="mb-4">Points preview</h2>
          <Table hover size="sm" responsive>
            <thead>
              <tr>
                <th>Result type</th>
                <th>Awarded by</th>
                <th>Description</th>
                <th>Reference</th>
                <th>Points</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>dsdssd</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>Mark</td>
                <th>Otto</th>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Mark</td>
                <th>Otto</th>
                <td>@mdo</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg={3} md={4} sm={12} className="order-md-2 order-sm-1">
          <h2 className="mb-4">Course grading</h2>
          <Alert color="primary" className="text-center">
            <span>Your current grading is</span>
            <h4 className="mt-1 mb-1">E</h4>
            <span>(5 more points to D)</span>
          </Alert>
          <Table hover size="sm" responsive>
            <tbody>
              <tr className="border-bottom">
                <th>0 - 25 b</th>
                <th>Fx</th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(StudentOverview))
