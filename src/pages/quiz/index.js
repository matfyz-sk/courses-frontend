import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  // Container,
  Row,
  Col,
} from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'

import apiConfig from '../../configuration/api'
import NewTopic from './topics/new-topic'
import { QuestionAssignment } from './question/question-assignment/question-assignment'
import SideNav from '../../side-nav.tsx'
import QuestionOverview from './question/question-overview/question-overview'

import QuizAssignmentsOverview from './quiz/quiz-assignment-overview/quiz-assignments-overview'
import QuizAssignment from './quiz/quiz-assignment/quiz-assignment'
import TopicsOverviewData from './question/topics-overview/topics-overview-data'
import QuestionNewData from './question/question/question-new-data'
import { store } from '../../index'
import { setSubNav } from '../../redux/actions/navigationActions'
// import QuizTake from './quiz/quiz-take/quiz-take';

//PROD
const users = {
  teacherHumbert: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/DhMok`, // Humbert
  },
  studentAlojz: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/K8kDX`, // Alojz
  },
  studentLujza: {
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
    userId: `http://www.courses.matfyz.sk/data/user/WksXq`, // Lujza
  },
}

//DEV
// const users = {
//   teacherHumbert: {
//     token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
//     userId: `http://www.courses.matfyz.sk/data/user/cscNJ`, // Humbert
//   },
//   studentAlojz: {
//     token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
//     userId: `http://www.courses.matfyz.sk/data/user/n07Ph`, // Alojz
//   },
//   studentLujza: {
//     token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
//     userId: `http://www.courses.matfyz.sk/data/user/KH3N7`, // Lujza
//   },
// }

class Quiz extends Component {
  state = {
    activeUser: null,
    courseInstanceId: 'http://www.courses.matfyz.sk/data/courseInstance/aJpGT', //PROD
    // courseInstanceId: 'http://www.courses.matfyz.sk/data/courseInstance/nUcWD', //DEV
  }

  componentDidMount() {
    store.dispatch(setSubNav('quiz'))
    const { user } = this.props
    if (user) {
      const { _token: token } = user
      const { id: userId } = user.user
      if (token && userId) {
        this.getUser(
          userId.substring(userId.lastIndexOf('/') + 1),
          `Bearer ${token}`
        )
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props
    if (JSON.stringify(user) !== JSON.stringify(prevProps.user)) {
      if (user) {
        const { _token: token } = user
        const { id: userId } = user.user
        if (token && userId) {
          this.getUser(
            userId.substring(userId.lastIndexOf('/') + 1),
            `Bearer ${token}`
          )
        }
      }
    }
  }

  getUser = (userId, token) => {
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
    const { user } = this.props
    // eslint-disable-next-line no-underscore-dangle
    const token = user._token ? `Bearer ${user._token}` : null
    let userId = null
    let studentOf = null
    let instructorOf = null
    if (activeUser) {
      userId = activeUser.id
      studentOf = activeUser.studentOf
      instructorOf = activeUser.instructorOf
    }
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
          {/* <SideNav /> */}
        </Col>
        <Col xs="12" md="9">
          <Switch>
            <Route
              exact
              path="/courses/:courseId/quiz"
              render={({ match }) => (
                <TopicsOverviewData
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                  match={match}
                />
              )}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/createTopic"
              render={({ match }) => (
                <NewTopic
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                />
              )}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/questionGroups"
              render={({ match }) => (
                <TopicsOverviewData
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                  match={match}
                />
              )}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/question"
              render={({ history, match }) => (
                <QuestionNewData
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
                  isTeacher={isTeacher}
                  token={token}
                  userId={userId}
                  history={history}
                />
              )}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/questionEdit/:questionType/:questionId"
              render={({ match, history }) => (
                <QuestionOverview
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
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
              path="/courses/:courseId/quiz/questionAssignment"
              render={({ match, history }) => (
                <QuestionAssignment
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
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
              path="/courses/:courseId/quiz/questionAssignment/:questionAssignmentId"
              render={({ match, history }) => (
                <QuestionAssignment
                  courseInstanceId={`http://www.courses.matfyz.sk/data/courseInstance/${match?.params?.courseId}`}
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
              path="/courses/:courseId/quiz/quizAssignmentsOverview"
              component={QuizAssignmentsOverview}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/quizAssignment"
              component={QuizAssignment}
            />
            <Route
              exact
              path="/courses/:courseId/quiz/quizAssignment/:id"
              component={QuizAssignment}
            />
            {/* <Route exact path="/quiz/quizTake/:id" component={QuizTake} /> */}
          </Switch>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = ({ userReducer, coursesReducer, authReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    course: coursesReducer.course,
    user: authReducer,
  }
}

export default connect(mapStateToProps, {})(Quiz)
// export default Quiz
