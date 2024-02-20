import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  withStyles,
} from '@material-ui/core'

import {
  baseTheme,
  CustomAccordion,
  GreenCheckbox,
  useNewQuizStyles,
} from './styles'

import { MdCheck, MdLocalPizza } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa'
import { Link, withRouter } from 'react-router-dom'
import { redirect } from '../../constants/redirect'
import { QUIZ_QUESTION_DETAIL_NEW } from '../../constants/routes'

function QuestionAccordionItem({
  courseId,
  questionId,
  questionText,
  questionAnswers,
}) {
  const classes = useNewQuizStyles()

  const questionShortId = questionId.slice(questionId.lastIndexOf('/') + 1)

  const answers = questionAnswers.map(answer => {
    return (
      <FormControlLabel
        key={crypto.randomUUID()}
        control={<GreenCheckbox />}
        label={answer.text}
      />
    )
  })

  return (
    <CustomAccordion className={classes.questionAccordionItem} id={questionId}>
      <AccordionSummary expandIcon={<FaAngleDown />}>
        {questionText}
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.accordionContentLeft}>
          <FormGroup>{answers}</FormGroup>
        </div>
        <div className={classes.accordionContentRight}>
          <Button variant="contained" startIcon={<MdCheck />}>
            Check answer
          </Button>
          <Link
            to={redirect(QUIZ_QUESTION_DETAIL_NEW, [
              { key: 'course_id', value: courseId },
              { key: 'question_id', value: questionShortId },
            ])}
            className="btn btn-secondary"
          >
            View details
          </Link>
        </div>
      </AccordionDetails>
    </CustomAccordion>
  )
}

export default withRouter(QuestionAccordionItem)
