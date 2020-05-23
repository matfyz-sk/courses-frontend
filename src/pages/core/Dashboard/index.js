import React from 'react'
import { Col, Container, Row } from 'reactstrap'
import MyCourses from './MyCourses'
import MyInstructorCourses from './MyInstructorCourses'
import MyResults from './MyResults'
import MyTeams from './MyTeams'

const Dashboard = props => {
  return (
    <Container>
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col sm={7}>
          <MyInstructorCourses />
          <MyCourses />
        </Col>
        <Col sm={5}>
          <MyResults />
          <MyTeams />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
