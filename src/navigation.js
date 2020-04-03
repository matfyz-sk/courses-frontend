import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import PageHeader from './pageHeader'

import MainPage from './pages/mainPage'
import Assignments from './pages/assignments'
import Files from './pages/files'
import Info from './pages/info'
import Labs from './pages/labs'
import Lectures from './pages/lectures'
import Results from './pages/results'
import Quiz from './pages/quiz'

function Navigation(props) {
  return (
    <>
      <PageHeader {...props} />
      <Container>
        <Row>
          <Col xs="12" md="12">
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route path="/assignments" component={Assignments} />
              <Route exact path="/files" component={Files} />
              <Route exact path="/info" component={Info} />
              <Route exact path="/labs" component={Labs} />
              <Route exact path="/lectures" component={Lectures} />
              <Route path="/quiz" component={Quiz} />
              <Route exact path="/results" component={Results} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Navigation
