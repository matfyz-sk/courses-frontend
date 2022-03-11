import React, { useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { customTheme, useStyles } from '../../common/style/styles'
import { Box, Button, ButtonGroup, Typography } from '@material-ui/core'
import QuizQuestion from '../../common/quiz-question'
import { evaluate } from '../../common/functions/fetch-data-functions'
import { grey } from '@material-ui/core/colors'
import { QuestionTypesEnums } from '../../common/functions/type-enums'

function SelfQuizResult({
                          questions,
                          topics,
                          showCorrect,
                        }) {

  const style = useStyles()

  const [ openedCorrect, setOpenedCorrect ] = useState([])

  const openCorrectAnswer = (questionId) => {
    const index = openedCorrect.indexOf(questionId)
    const newOpened = [ ...openedCorrect ];
    if(index === -1) {
      newOpened.push(questionId);
    } else {
      newOpened.splice(index, 1);
    }
    setOpenedCorrect(newOpened);
  }

  const getResult = (questions) => {
    const numOfCorrect = questions.reduce((acc, question) => evaluate(question) ? ++acc : acc, 0)
    const percentage = (numOfCorrect / questions.length) * 100
    return (
      <Box marginBottom={ 3 }>
        <Box className={ style.centeredSection } marginBottom={ 1 }>
          <h1>Result</h1>
        </Box>
        <Box className={ style.centeredSection } marginBottom={ 1 }>
          <Typography variant='h4'>
            { numOfCorrect } / { questions.length }
          </Typography>
        </Box>
        <Box className={ style.centeredSection } marginBottom={ 3 }>
          <Typography variant='h4'>
            { percentage.toFixed(1) }%
          </Typography>
        </Box>
      </Box>
    )
  }

  const getResultByTopic = () => {
    return (topics.map(topic => {
      const relevantQuestions = questions.filter(question => question.question.ofTopic['@id'] === topic['@id'])
      if(relevantQuestions.length > 0) {
        const numOfCorrect = relevantQuestions.reduce((acc, question) => evaluate(question) ? ++acc : acc, 0)
        const percentage = (numOfCorrect / relevantQuestions.length) * 100
        return (
          <Box key={ topic['@id'] } className={ style.centeredSection } margin={ 2 }>
            <Box display='flex' alignItems='center' width='45%' marginRight={ 4 }>
              <Typography>{ topic.name }</Typography>
            </Box>
            <Box display='flex' alignItems='center' width='7%' marginRight={ 2 }>
              <Typography><b>{ numOfCorrect } / { relevantQuestions.length }</b></Typography>
            </Box>
            <Box display='flex' alignItems='center' width='8%' marginRight={ 2 }>
              <Typography><b>{ percentage.toFixed(1) }%</b></Typography>
            </Box>
          </Box>
        )
      }
    }))
  }


  return (
    <ThemeProvider theme={ customTheme }>
      <Box marginBottom={ 6 }>
        { getResult(questions) }
        <Box className={ style.centeredSection } marginBottom={ 1 }>
          <Typography variant='h5'>Score by topic</Typography>
        </Box>
        <Box marginBottom={ 4 }>
          { getResultByTopic() }
        </Box>
        { questions.map((question, index) => {
          return (
            <Box key={ question.question.id }>
              <QuizQuestion
                index={ index }
                correct={ false }
                question={ question }
                variant={ openedCorrect.indexOf(question.question.id) === -1 ? "quizGradedUser" : "quizGradedCorrect" }
              />
              { showCorrect && !evaluate(question) && question.question.questionType !== QuestionTypesEnums.essay.id &&
                <Box width='100%' padding={ 3 } style={ {backgroundColor: grey[100]} } marginBottom={ 3 }
                     border={ `1px solid ${ grey[300] }` } borderTop={ 0 } display='flex' justifyContent='flex-end'
                     alignItems='center'>
                  <ButtonGroup color='primary' size='small' disableElevation
                               onClick={ e => openCorrectAnswer(question.question.id) }>
                    <Button variant={ openedCorrect.indexOf(question.question.id) === -1 ? 'contained' : 'outlined' }>Your
                      answer</Button>
                    <Button variant={ openedCorrect.indexOf(question.question.id) !== -1 ? 'contained' : 'outlined' }>Correct
                      answer</Button>
                  </ButtonGroup>
                </Box> }
            </Box>
          )
        })
        }
      </Box>
    </ThemeProvider>
  )
}

export default SelfQuizResult
