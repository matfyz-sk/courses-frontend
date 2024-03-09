import React from 'react'
import { Link } from 'react-router-dom'
import { redirect } from '../../constants/redirect'
import { ADD_QUIZ_QUESTION_NEW } from '../../constants/routes'
import QuestionListItem from './questionListItem'
import { useNewQuizStyles } from './styles'
import { withRouter } from 'react-router'
import { useGetQuestionsQuery } from '../../services/quiz-new'
import { DATA_PREFIX } from '../../constants/ontology'

function QuizNewHomepage({ courseId }) {
  const classes = useNewQuizStyles()

  const longCourseId = `${DATA_PREFIX}courseInstance/${courseId}`

  const {
    data: questions,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetQuestionsQuery({ courseInstanceId: longCourseId })

  console.log(questions)

  let renderedContent
  if (isLoading) {
    renderedContent = <h3>Loading...</h3>
  } else if (isSuccess) {
    if (questions) {
      let previousVersions = []
      questions.forEach(question => {
        if (question.previous) {
          previousVersions.push(question.previous._id)
        }
      })
      let questionsToShow = questions.filter(
        question => !previousVersions.includes(question._id)
      )
      renderedContent = questionsToShow.map(question => {
        return (
          <QuestionListItem
            key={crypto.randomUUID()}
            courseId={courseId}
            questionId={question._id}
            questionText={question.text}
            questionAnswers={question.hasPredefinedAnswer}
          />
        )
      })
    } else {
      renderedContent = <div>No questions yet, add the first one!</div>
    }
  }

  return (
    <div className={classes.quizMain}>
      <div className={classes.quizNewHeader}>
        <h1>Quiz Questions</h1>
        <Link
          to={redirect(ADD_QUIZ_QUESTION_NEW, [
            { key: 'course_id', value: courseId },
          ])}
          className="btn btn-success mb-2"
        >
          Add new question
        </Link>
      </div>
      {renderedContent}
    </div>
  )
}

export default withRouter(QuizNewHomepage)
