import { React, useState } from 'react'
import { Input, FormControlLabel, IconButton } from '@material-ui/core'
import { MdDelete, MdImage } from 'react-icons/md'

import { CustomTextField, GreenCheckbox, GreenIconButton } from './styles'
import { useNewQuizStyles } from './styles'
import ImagePreview from './ImagePreview'

function QuestionAnswerField({
  error,
  onDeleteButtonClicked,
  onTextChanged,
  onCorrectChanged,
  defaultTextValue,
  defaultCheckedValue,
  inputId,
  onImageChanged,
}) {
  const [correct, setCorrect] = useState(false)
  //const [answerText, setAnswerText] = useState('')

  const classes = useNewQuizStyles()

  return (
    <>
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
        <Input
          accept="image/*"
          style={{ display: 'none' }}
          id={inputId}
          type="file"
          onChange={onImageChanged}
        />
        <label htmlFor={inputId}>
          <GreenIconButton aria-label="upload picture" component="span">
            <MdImage />
          </GreenIconButton>
        </label>
        <CustomTextField
          multiline
          error={error}
          helperText={error ? 'Answer text cannot be empty' : ''}
          className={classes.answerTextField}
          onChange={e => onTextChanged(e.target.value)}
          label={'Answer text'}
          variant="outlined"
          size="small"
          value={defaultTextValue}
        />
        <IconButton onClick={onDeleteButtonClicked}>
          <MdDelete />
        </IconButton>
      </div>
    </>
  )
}

export default QuestionAnswerField
