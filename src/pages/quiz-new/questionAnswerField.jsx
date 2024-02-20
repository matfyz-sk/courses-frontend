import { React, useState } from 'react'
import { Input, FormControlLabel, Button, IconButton } from '@material-ui/core'
import { MdDelete } from 'react-icons/md'

import { CustomTextField, GreenCheckbox } from './styles'
import { baseTheme, useNewQuizStyles } from './styles'
import TextField from '@material-ui/core/TextField'

function QuestionAnswerField({
  error,
  onDeleteButtonClicked,
  onTextChanged,
  onCorrectChanged,
  defaultTextValue,
  defaultCheckedValue,
}) {
  const [correct, setCorrect] = useState(false)
  //const [answerText, setAnswerText] = useState('')

  const classes = useNewQuizStyles()

  return (
    <div className={classes.questionAnswerField}>
      <FormControlLabel
        control={
          <GreenCheckbox
            checked={defaultCheckedValue ?? correct}
            onChange={() => {
              onCorrectChanged(!correct)
              setCorrect(!correct)
            }}
            name="checkedG"
          />
        }
        label="Correct"
      />
      <CustomTextField
        error={error}
        helperText={error ? 'Answer text cannot be empty' : ''}
        className={classes.answerTextField}
        onChange={e => onTextChanged(e.target.value)}
        label={'Answer text'}
        variant="outlined"
        size="small"
        value={defaultTextValue ?? ''}
      />
      <IconButton onClick={onDeleteButtonClicked}>
        <MdDelete />
      </IconButton>
    </div>
  )
}

export default QuestionAnswerField
