import React, { Component } from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'

import NewTopic from './topics/new-topic'
import { QuestionAssignment } from './question/question-assignment/question-assignment'
import QuizNav from './common/quiz-nav'
import QuestionOverview from './question/question-overview/question-chain-overview'

import QuizAssignmentsOverview from './quiz/quiz-assignment-overview/quiz-assignments-overview'
import QuizAssignment from './quiz/quiz-assignment/quiz-assignment'
import TopicsOverviewData from './question/topics-overview/topics-overview-data'
import QuestionNewData from './question/question/question-new-data'
import { store } from '../../index'
import { setSubNav } from '../../redux/actions/navigationActions'
import QuizTakeNew from './quiz/quiz-take/quiz-take-new'
import QuizTakeIntro from './quiz/quiz-take/quiz-take-intro'
import QuizTakeReview from './quiz/quiz-take/quiz-take-review'
import SelfQuizNew from './quiz/self-quiz/self-quiz-new'
import QuizTakesOverviewData from './quiz/quiz-take/quiz-takes-overview-data'
import QuizTakeStudentResult from './quiz/quiz-take/quiz-take-student-result'
import SelfQuizzes from './quiz/self-quiz/self-quizzes'
import { DATA_PREFIX } from 'constants/ontology'
import { API_URL } from '../../constants'

class Quiz extends Component {
  componentDidMount() {
    store.dispatch(setSubNav('quiz'))
    const { user } = this.props
    if (user && user.user) {
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
      if (user && user.user) {
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
      .get(`${API_URL}user/${userId}`, {
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
    const { user, match, history, courseInstance } = this.props
    // eslint-disable-next-line no-underscore-dangle
    const token = user._token ? `Bearer ${user._token}` : null
    let userId = null
    if (user && user.user && user.user.fullURI) {
      userId = user.user.fullURI
    }

    const courseInstanceId = match?.params?.course_id
      ? `${DATA_PREFIX}courseInstance/${match.params.course_id}`
      : null
    let isTeacher = null
    if (
      courseInstance &&
      courseInstance.hasInstructor &&
      courseInstance.hasInstructor.length
    ) {
      isTeacher = courseInstance.hasInstructor.some(
        instructor => instructor['_id'] === user.user.fullURI
      )
    }
    return (
      <div className="container">
        <QuizNav match={match} />
        <Switch>
          <Route
            exact
            path="/courses/:courseId/quiz"
            render={({ match: matchChild }) => (
              <TopicsOverviewData
                courseInstanceId={courseInstanceId}
                isTeacher={isTeacher}
                token={token}
                userId={userId}
                match={matchChild}
                history2={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/createTopic"
            render={() => (
              <NewTopic isTeacher={isTeacher} token={token} userId={userId} />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/questionGroups"
            render={({ match: matchChild }) => (
              <TopicsOverviewData
                courseInstanceId={courseInstanceId}
                isTeacher={isTeacher}
                token={token}
                userId={userId}
                match={matchChild}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/question"
            render={() => (
              <QuestionNewData
                courseInstanceId={courseInstanceId}
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
            render={({ match: matchChild }) => (
              <QuestionOverview
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/questionAssignment"
            render={({ match: matchChild }) => (
              <QuestionAssignment
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/questionAssignment/:questionAssignmentId"
            render={({ match: matchChild }) => (
              <QuestionAssignment
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizAssignmentsOverview"
            render={({ match: matchChild }) => (
              <QuizAssignmentsOverview
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                match={matchChild}
                token={token}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizAssignment"
            render={({ match: matchChild }) => (
              <QuizAssignment
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizAssignmentEdit/:quizAssignmentType/:quizAssignmentId"
            render={({ match: matchChild }) => (
              <QuizAssignment
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizTakeIntro/:quizAssignmentId"
            render={({ match: matchChild }) => (
              // TODO delete later, just for testing
              <QuizTakeIntro
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          //TODO
          <Route
            exact
            path="/courses/:courseId/quiz/quizTake/:quizTakeId"
            render={({ match: matchChild }) => (
              <QuizTakeNew
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizTakesOverview/:quizAssignmentId"
            render={({ match: matchChild }) => (
              <QuizTakesOverviewData
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizTakeReview/:quizTakeId"
            render={({ match: matchChild }) => (
              <QuizTakeReview
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/quizResult/:quizTakeId"
            render={({ match: matchChild }) => (
              <QuizTakeStudentResult
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/selfQuizzes"
            render={({ match: matchChild }) => (
              <SelfQuizzes
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
          <Route
            exact
            path="/courses/:courseId/quiz/selfQuiz"
            render={({ match: matchChild }) => (
              <SelfQuizNew
                courseInstanceId={courseInstanceId}
                userId={userId}
                isTeacher={isTeacher}
                token={token}
                match={matchChild}
                history={history}
              />
            )}
          />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({
  userReducer,
  courseInstanceReducer,
  authReducer,
}) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    courseInstance: courseInstanceReducer.courseInstance,
    user: authReducer,
  }
}

export default connect(mapStateToProps, {})(Quiz)
// export default Quiz
