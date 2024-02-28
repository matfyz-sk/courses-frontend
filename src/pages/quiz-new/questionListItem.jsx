import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Checkbox,
  Chip,
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

function QuestionListItem({
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
    /*<CustomAccordion className={classes.questionAccordionItem} id={questionId}>
      <AccordionSummary style={{display: 'flex', justifyContent: 'space-between'}}>
        {questionText}
        <Link
          to={redirect(QUIZ_QUESTION_DETAIL_NEW, [
            { key: 'course_id', value: courseId },
            { key: 'question_id', value: questionShortId },
          ])}
          className="btn btn-secondary"
        >
          View details
        </Link>
      </AccordionSummary>
      {/!*<AccordionDetails>
        <div className={classes.accordionContentLeft}>
          <FormGroup>{answers}</FormGroup>
        </div>
        <div className={classes.accordionContentRight}>
          <Button variant="contained" startIcon={<MdCheck />}>
            Check answer
          </Button>

        </div>
      </AccordionDetails>*!/}
    </CustomAccordion>*/
    <Card variant="outlined" className={classes.questionListItem}>
      <div style={{ display: 'flex', columnGap: '5px', alignItems: 'center' }}>
        {questionText}
      </div>

      <Link
        to={redirect(QUIZ_QUESTION_DETAIL_NEW, [
          { key: 'course_id', value: courseId },
          { key: 'question_id', value: questionShortId },
        ])}
        style={{ color: baseTheme.palette.primary.main }}
      >
        Details
      </Link>
    </Card>
  )
}

export default withRouter(QuestionListItem)
