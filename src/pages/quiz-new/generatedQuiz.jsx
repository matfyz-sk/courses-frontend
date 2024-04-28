import React from 'react'
import QuestionDetailWithCheckAnswer from './questionDetailWithCheckAnswer'
import { Link, withRouter } from 'react-router-dom'
import { useLocation } from 'react-router'
import { redirect } from '../../constants/redirect'
import { QUIZNEW } from '../../constants/routes'
import { useNewQuizStyles } from './styles'
import { MdCheck } from 'react-icons/md'
import { Button } from '@material-ui/core'

function GeneratedQuiz({ courseId }) {
  const location = useLocation()
  const classes = useNewQuizStyles()
  let questions = location.state.questions
  // mozno bude fajn pamatat si ku kazdej otazke jej text + spravne odpovede a potom porovnavat s odpovedami ktore k danej otazke vybral pouzivatel??
  // a potom podla poradia v zozname otazok asi dat idcko alebo key komponentu, aby sme vedeli zobrazit correct / incorrect
  // a mozno vlastne ani netreba text, len zoznam zoznamov spravnych odpovedi i guess??? idk
  let approvedQuestions = []
  for (let question of questions) {
    if (question.approver) {
      approvedQuestions.push(question)
    }
  }
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

  let renderedQuestions = approvedQuestions.map(questionData => {
    return (
      <QuestionDetailWithCheckAnswer
        key={crypto.randomUUID()}
        question={questionData}
      />
    )
  })
  return (
    <div className={classes.container}>
      <Link
        to={redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])}
        className="btn btn-outline-success mb-2"
      >
        Back
      </Link>
      {renderedQuestions}
      <Button variant="contained" startIcon={<MdCheck />} onClick={''}>
        Check answer
      </Button>
    </div>
  )
}

export default withRouter(GeneratedQuiz)
