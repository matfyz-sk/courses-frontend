import React from 'react'
import { Button, Card, FormControlLabel, Chip } from '@material-ui/core'
import { MdDone } from 'react-icons/md'
import {
  baseTheme,
  CustomAccordion,
  GreenCheckbox,
  useNewQuizStyles,
} from './styles'

import { Link, withRouter } from 'react-router-dom'
import { redirect } from '../../constants/redirect'
import { QUIZ_QUESTION_DETAIL_NEW } from '../../constants/routes'

function QuestionListItem({
  courseId,
  questionId,
  questionText,
  questionAnswers,
  isApproved,
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
      <div>
        {questionText}
        {isApproved ? (
          <Chip
            style={{ marginLeft: '10px' }}
            size="small"
            label="Approved"
            icon={<MdDone />}
          />
        ) : (
          ''
        )}
      </div>

      <Link
        to={{
          pathname: redirect(QUIZ_QUESTION_DETAIL_NEW, [
            { key: 'course_id', value: courseId },
            { key: 'question_id', value: questionShortId },
          ]),
          state: {
            hasNewerVersion: false,
          },
        }}
        style={{ color: baseTheme.palette.primary.main }}
      >
        Details
      </Link>
    </Card>
  )
}

export default withRouter(QuestionListItem)
