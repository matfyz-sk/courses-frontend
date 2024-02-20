import React from 'react'
import AddQuestionForm from './addQuestionForm'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { NavLink, Link, Route, Switch, Router } from 'react-router-dom'
import { useGetQuestionsQuery } from '../../services/quiz-new'
import * as ROUTES from '../../constants/routes'
import QuizNewHomepage from './quizNewHomepage'
import { ThemeProvider } from '@material-ui/styles'
import { customQuizTheme } from './styles'
import QuestionDetail from './questionDetail'
import EditQuestionForm from './editQuestionForm'

function QuizNew({ match }) {
  const courseId = match.params.course_id

  return (
    <ThemeProvider theme={customQuizTheme}>
      <Switch>
        <Route
          exact
          path={ROUTES.QUIZNEW}
          render={() => <QuizNewHomepage courseId={courseId} />}
        />
        <Route
          exact
          path={ROUTES.QUIZ_QUESTION_DETAIL_NEW}
          render={() => <QuestionDetail courseId={courseId} />}
        />
        <Route
          exact
          path={ROUTES.ADD_QUIZ_QUESTION_NEW}
          render={() => (
            <div>
              <AddQuestionForm courseId={courseId} />
            </div>
          )}
        />
        <Route
          exact
          path={ROUTES.EDIT_QUESTION_NEW}
          render={() => <EditQuestionForm courseId={courseId} />}
        />
      </Switch>
    </ThemeProvider>
  )
}

export default withRouter(QuizNew)
