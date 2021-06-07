import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { customTheme, useStyles } from '../../common/style/styles'
import { setAnswers, setUserAnswers } from '../../common/functions/answers-functions'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import QuizQuestion from '../../common/quiz-question'
import { grey } from '@material-ui/core/colors'
import { Box, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

function SelfQuizQuiz ({
                         questions,
                         quizQuestions,
                         setQuizQuestions,
                         evaluateQuiz,
                       }) {

  const style = useStyles()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const createData = async () => {
      return await createQuizQuestions().then(response => response)
    }

    createData().then(response => {
      setQuizQuestions(response)
      setLoading(false)
    })
  },[])

  const setUserAnswer = async (questionId, userAnswer) => {
    setQuizQuestions(prevState => prevState.map(q => {
      return q.question.id === questionId ?
        {...q, userAnswer: userAnswer } : q
    }))
  }

  const createQuizQuestions = async () => {
    return await questions.reduce(async (acc, question) => {
      const currentAcc = await acc
      const questionFullId = question['@id']
      const qType = questionFullId.substring(
        questionFullId.lastIndexOf('/', questionFullId.lastIndexOf('/') - 1) + 1,
        questionFullId.lastIndexOf('/')
      )
      const qId = getShortID(question['@id'])
      const questionDataRaw = await axiosGetEntities(`${qType}/${qId}?_join=hasAnswer`)
        .then(response => getResponseBody(response)[0])
        .catch(error => console.log(error))
      const questionData = {
        id: questionDataRaw['@id'],
        questionType: questionDataRaw['@type'],
        title: questionDataRaw.name,
        questionText: questionDataRaw.text,
        ofTopic: questionDataRaw.ofTopic[0]
      }
      const questionWAnswers = setAnswers(questionData, questionDataRaw, true)
      const questionBase = {
        question: questionWAnswers,
        points: 1,
        setUserAnswer: userAnswer => setUserAnswer(question['@id'], userAnswer),
      }
      setUserAnswers(questionBase)
      currentAcc.push(questionBase)
      return currentAcc
    }, [])
  }

  const resetQuestion = (question) => {
    let newQuestions = [...quizQuestions]
    const index = quizQuestions.map(q => q.question.id).indexOf(question.question.id)
    newQuestions[index] = setUserAnswers(question)
    setQuizQuestions(newQuestions)
  }

  return (
    <ThemeProvider theme={customTheme}>
      {loading ?
        <div style={{marginTop: 20, marginBottom: 20}}>
          <Alert severity='success' icon={false}>
            Loading...
          </Alert>
        </div> :
        <Box>
          {quizQuestions.map((question, index) => {
            return (
              <Box key={question.question.id} marginTop={5} marginBottom={5} border={`1px solid ${grey[300]}`}>
                <QuizQuestion
                  index={index}
                  question={question}
                  variant='selfQuizTake'
                  resetQuestion={resetQuestion}
                />
              </Box>
            )
          })}
          <Box className={style.centeredSection}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              style={{ fontSize: 17 }}
              onClick={e => evaluateQuiz()}
            >
              Evaluate quiz
            </Button>
          </Box>
        </Box>
      }
    </ThemeProvider>
  )
}

export default SelfQuizQuiz
