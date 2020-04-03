import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

import NewTopic from './topics/new-topic'
import { QuestionAssignment } from './question/question-assignment/question-assignment'
import Question from './question/question/question'
import QuestionOverview from './question/question-overview/question-overview'

import QuizAssignmentsOverview from './quiz/quiz-assignment-overview/quiz-assignments-overview'
import QuizAssignment from './quiz/quiz-assignment/quiz-assignment'
import TopicsOverviewData from './question/topics-overview/topics-overview-data'
// import QuizTake from './quiz/quiz-take/quiz-take';

class Quiz extends Component {
  token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`

  courseInstanceId = 'http://www.courses.matfyz.sk/data/courseInstance/wvQrF'

  isTeacher = true

  render() {
    return (
      <Container>
        <Row>
          <Col xs="12" md="3">
            {/* //TODO if someone solve how to side navigation pls implement it, i'm sure there is better way
                  <SideNav />  */}
          </Col>
          <Col xs="12" md="9">
            <Switch>
              <Route
                exact
                path="/quiz"
                render={() => (
                  <TopicsOverviewData
                    courseInstanceId={this.courseInstanceId}
                    isTeacher={this.isTeacher}
                    token={this.token}
                  />
                )}
              />
              <Route exact path="/quiz/createTopic" component={NewTopic} />
              <Route
                exact
                path="/quiz/questionGroups"
                render={() => (
                  <TopicsOverviewData
                    courseInstanceId={this.courseInstanceId}
                    isTeacher={this.isTeacher}
                    token={this.token}
                  />
                )}
              />
              <Route exact path="/quiz/question" component={Question} />
              <Route
                exact
                path="/quiz/question/:id"
                component={QuestionOverview}
              />
              <Route
                exact
                path="/quiz/questionAssignment"
                render={({ match, history }) => (
                  <QuestionAssignment
                    token={this.token}
                    match={match}
                    history={history}
                    courseInstanceId={this.courseInstanceId}
                    isTeacher={this.isTeacher}
                  />
                )}
              />
              <Route
                exact
                path="/quiz/questionAssignment/:id"
                render={({ match, history }) => (
                  <QuestionAssignment
                    token={this.token}
                    match={match}
                    history={history}
                    courseInstanceId={this.courseInstanceId}
                    isTeacher={this.isTeacher}
                  />
                )}
              />
              <Route
                exact
                path="/quiz/quizAssignmentsOverview"
                component={QuizAssignmentsOverview}
              />
              <Route
                exact
                path="/quiz/quizAssignment"
                component={QuizAssignment}
              />
              <Route
                exact
                path="/quiz/quizAssignment/:id"
                component={QuizAssignment}
              />
              {/* <Route exact path="/quiz/quizTake/:id" component={QuizTake} /> */}
            </Switch>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Quiz
