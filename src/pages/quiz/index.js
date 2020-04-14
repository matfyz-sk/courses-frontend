import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  // Container,
  Row,
  Col,
} from 'reactstrap'
import axios from 'axios'

import apiConfig from '../../configuration/api'
import NewTopic from './topics/new-topic'
import { QuestionAssignment } from './question/question-assignment/question-assignment'
import SideNav from '../../side-nav.tsx'
import QuestionOverview from './question/question-overview/question-overview'

import QuizAssignmentsOverview from './quiz/quiz-assignment-overview/quiz-assignments-overview'
import QuizAssignment from './quiz/quiz-assignment/quiz-assignment'
import TopicsOverviewData from './question/topics-overview/topics-overview-data'
import QuestionNew from './question/question/question-new'
import {store} from "../../index";
import {setSubNav} from "../../redux/actions/navigationActions";
// import QuizTake from './quiz/quiz-take/quiz-take';

const users = {
  teacherHumbert: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/5QzvA`, // Humbert
  },
  studentAlojz: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/OQQ4p`, // Alojz
  },
  studentLujza: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/99bGZ`, // Lujza
  },
}
class Quiz extends Component {
  state = {
    activeUser: users.teacherHumbert,
    courseInstanceId: 'http://www.courses.matfyz.sk/data/courseInstance/wvQrF',
  }

  componentDidMount() {
    store.dispatch(setSubNav('quiz'));

    const { activeUser } = this.state
    if (activeUser) {
      const { userId, token } = activeUser
      if (userId && token) {
        this.getUser(userId.substring(userId.lastIndexOf('/') + 1), token)
      }
    }
  }

  getUser = (userId, token) => {
    const { activeUser } = this.state
    return axios
      .get(`${apiConfig.API_URL}/user/${userId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const user = data['@graph'][0]
          const {
            studentOf: studentOfData,
            instructorOf: instructorOfData,
          } = user
          const id = user['@id']
          const studentOf = studentOfData.map(courseInstance => {
            return courseInstance['@id']
          })
          const instructorOf = instructorOfData.map(courseInstance => {
            return courseInstance['@id']
          })
          const activeUserMapped = {
            ...activeUser,
            id,
            studentOf,
            instructorOf,
          }

          this.setState({
            activeUser: activeUserMapped,
          })
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const { activeUser, courseInstanceId } = this.state
    const {
      token,
      userId,
      // studentOf,
      instructorOf,
    } = activeUser

    let isTeacher = null
    // let isStudent = null
    if (instructorOf) {
      isTeacher = instructorOf.includes(courseInstanceId)
    }
    // if (studentOf) {
    //   isStudent = studentOf.includes(courseInstanceId)
    // }
    return (
      <Row>
        <Col xs="12" md="3">
          <SideNav />
        </Col>
        <Col xs="12" md="9">
          <Switch>
            <Route
              exact
              path="/quiz"
              render={() => (
                <TopicsOverviewData
                  courseInstanceId={courseInstanceId}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                />
              )}
            />
            <Route
              exact
              path="/quiz/createTopic"
              render={() => (
                <NewTopic
                  courseInstanceId={courseInstanceId}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                />
              )}
            />
            <Route
              exact
              path="/quiz/questionGroups"
              render={() => (
                <TopicsOverviewData
                  courseInstanceId={courseInstanceId}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                />
              )}
            />
            {/* <Route exact path="/quiz/question" component={Question} /> */}
            <Route
              exact
              path="/quiz/question"
              render={() => (
                <QuestionNew
                  courseInstanceId={courseInstanceId}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                />
              )}
            />
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
                  courseInstanceId={courseInstanceId}
                  userId={userId}
                  isTeacher={isTeacher}
                  token={token}
                  match={match}
                  history={history}
                />
              )}
            />
            <Route
              exact
              path="/quiz/questionAssignment/:id"
              render={({ match, history }) => (
                <QuestionAssignment
                  courseInstanceId={courseInstanceId}
                  userId={userId}
                  isTeacher={isTeacher}
                  token={token}
                  match={match}
                  history={history}
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
    )
  }
}

export default Quiz
