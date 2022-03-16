import React from 'react'
import { TextField, Typography } from '@material-ui/core'

const enText = {
  answerLabel: 'Answer',
}

function AnswerComponentEssay({userAnswer, setUserAnswer}){

  const handleUserAnswer = (e) => {
    setUserAnswer(e.target.value)
  }

  return (
    <div>
      {setUserAnswer ?
        <TextField
          fullWidth
          multiline
          rows={7}
          rowsMax={20}
          variant='outlined'
          value={userAnswer}
          onChange={e => handleUserAnswer(e)}
        />
        :
        userAnswer &&
        <Typography variant='subtitle1' style={{maxWidth: '100%'}}>
          {userAnswer}
        </Typography>
      }
    </div>
  )
}

export default AnswerComponentEssay
