import React from 'react'
import { Link } from 'react-router-dom'
import { redirect } from '../../constants/redirect'
import { ADD_QUIZ_QUESTION_NEW, GENERATED_QUIZ } from '../../constants/routes'
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

  let renderedContent
  let generateButton = ''
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

      let approvedQuestions = questions.filter(question => question.approver)
      for (let i = approvedQuestions.length - 1; i > 0; i--) {
        // shuffle array
        let j = Math.floor(Math.random() * (i + 1))
        ;[approvedQuestions[i], approvedQuestions[j]] = [
          approvedQuestions[j],
          approvedQuestions[i],
        ]
      }

      while (approvedQuestions.length > 10) {
        let rnd = Math.floor(Math.random() * approvedQuestions.length)
        approvedQuestions.splice(rnd, 1)
      }

      generateButton = (
        <Link
          to={{
            pathname: redirect(GENERATED_QUIZ, [
              { key: 'course_id', value: courseId },
            ]),
            state: {
              questions: approvedQuestions,
            },
          }}
          className="btn btn-outline-success mb-2"
        >
          Generate Quiz
        </Link>
      )
      renderedContent = questionsToShow.map(question => {
        let questionAuthorName
        if (!question.questionSubmittedBy) {
          questionAuthorName = 'Unknown'
        } else {
          if (question.questionSubmittedBy.nickname) {
            questionAuthorName = question.questionSubmittedBy.nickname
          } else {
            questionAuthorName = `${question.questionSubmittedBy.firstName} ${question.questionSubmittedBy.lastName}`
          }
        }
        return (
          <QuestionListItem
            key={crypto.randomUUID()}
            courseId={courseId}
            questionId={question._id}
            questionText={question.text}
            questionAnswers={question.hasPredefinedAnswer}
            isApproved={question.approver}
            questionAuthor={questionAuthorName}
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
      {generateButton}
      {renderedContent}
    </div>
  )
}

export default withRouter(QuizNewHomepage)
