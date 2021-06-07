import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { customTheme, useStyles } from '../../common/style/styles'
import {
  axiosAddEntity,
  axiosGetEntities,
  getResponseBody,
  getShortID,
} from '../../../../helperFunctions'
import { QuestionTypesEnums } from '../../common/functions/type-enums'
import { generateQuestionsRaw, topicData } from '../../common/functions/generation_functions'
import { Box, Button, Typography } from '@material-ui/core'
import SelfQuizQuiz from './self-quiz-quiz'
import SelfQuizResult from './self-quiz-result'
import { Alert } from '@material-ui/lab'
import SelfQuizGeneration from './self-quiz-generation'
import { createExportDataUserAnswer } from '../../common/functions/answers-functions'
import { evaluate } from '../../common/functions/fetch-data-functions'
import { union } from '../../common/functions/common-functions'

function SelfQuizNew({
                       courseInstanceId,
                       match,
                       history,
                     }){

  const style = useStyles()

  const [topics, setTopics] = useState({})
  const [publicQuestions, setPublicQuestions] = useState([])
  const [availableQuestions, setAvailableQuestions] = useState([])
  const [generationData, setGenerationData] = useState([])

  const [openTab, setOpenTab] = useState(0)
  const [loading, setLoading] = useState(true)

  const [quizQuestions, setQuizQuestions] = useState([])

  useEffect(()=>{
    const getData = async () => {
      const data = {}
      data.topics = await getTopicsAll().then(resp => resp)
      data.questions = await getQuestions().then(resp => resp)
      return(data)
    }

    getData().then(data => {
      setTopics(data.topics)
      setPublicQuestions(data.questions)
      setAvailableQuestions(data.questions.filter(question => data.topics.covers.some(topic => topic['@id'] === question.ofTopic[0]['@id'])))

      const allTopics = union(data.topics.covers, union(data.topics.mentions, data.topics.requires))
      setGenerationData(createGenerationData(allTopics, data.questions))
      setLoading(false)
    })

  },[])

  const getTopicsAll = async () => {
    let topics = {}
    await axiosGetEntities(`topic?covers=${courseInstanceId}`)
      .then(response => {
        topics.covers= getResponseBody(response)
      })
      .catch( error => console.log(error))
    await axiosGetEntities(`topic?mentions=${courseInstanceId}`)
      .then(response => {
        topics.mentions= getResponseBody(response)
      })
      .catch( error => console.log(error))
    await axiosGetEntities(`topic?requires=${courseInstanceId}`)
      .then(response => {
        topics.requires= getResponseBody(response)
      })
      .catch( error => console.log(error))
    return topics
  }

  const getQuestions = async () => {
    let questions
    await axiosGetEntities(`question?approver=iri&courseInstance=${getShortID(courseInstanceId)}&visibilityIsRestricted=false`)
      .then(response =>
        questions = getResponseBody(response).filter(question => question['@type'] !== QuestionTypesEnums.essay.id))
      .catch(error => console.log(error))
    return questions
  }

  function createGenerationData (topics, questions) {
    const topicsNotEmpty = topics.filter(topic =>
      questions.reduce((acc,question) => question.ofTopic[0]['@id'] === topic['@id'] ? ++acc : acc, 0) > 0 )
    return [topicData(-1, "All topics")].concat(
      topicsNotEmpty.reduce((acc,topic) => {
        acc.push(topicData(topic['@id'], topic.name))
        return acc
      }, []))
  }

  const saveQuiz = (questions) => {
    const selfQuizTakeData = {
      courseInstance: courseInstanceId,
      submittedDate: new Date(),
      orderedQuestion: questions.reduce((acc, oQ, index) => {
        acc.push({
          question: oQ.question.id,
          userAnswer: createExportDataUserAnswer(oQ),
          score: evaluate(oQ),
          points: oQ.points,
          position: index,
          _type: 'orderedQuestion',
        })
        return acc
      },[]),
      _type: 'selfQuizTake',
    }
    const maxScore = questions.length
    const score = selfQuizTakeData.orderedQuestion.reduce((acc, question) => acc + question.score, 0)
    const percentage = ((score / maxScore) * 100).toFixed(1)

    selfQuizTakeData.score = (percentage)
    axiosAddEntity(selfQuizTakeData, 'selfQuizTake')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }

  const evaluateQuiz = () => {
    saveQuiz(quizQuestions)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpenTab(2)
  }

  const handleGenerateQuiz = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpenTab(1)
  }

  const startNewQuiz = () => {
    const allTopics = union(topics.covers, union(topics.mentions, topics.requires))
    setGenerationData(createGenerationData(allTopics, publicQuestions))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpenTab(0)
  }

  const handleExit = () => {
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/selfQuizzes`,
    })
  }

  function getContent() {
    switch (openTab){
      case 0:
        return (
          <Box>
            <SelfQuizGeneration
              topics={topics}
              publicQuestions={publicQuestions}
              availableQuestions={availableQuestions}
              setAvailableQuestions={setAvailableQuestions}
              generationData={generationData}
              setGenerationData={setGenerationData}
            />
            <Box className={style.centeredSection}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                style={{ fontSize: 17 }}
                onClick={e => handleGenerateQuiz()}
              >
                Generate quiz
              </Button>
            </Box>
            <Box className={style.centeredSection} marginTop={2}>
              <Button
                variant='outlined'
                color='primary'
                size='large'
                style={{ fontSize: 17 }}
                onClick={e => handleExit()}
              >
                Close
              </Button>
            </Box>
          </Box>
        )
      case 1:
        return (
          <Box>
            <SelfQuizQuiz
              questions={generateQuestionsRaw(generationData, availableQuestions)}
              quizQuestions={quizQuestions}
              setQuizQuestions={setQuizQuestions}
              evaluateQuiz = {evaluateQuiz}
            />
          </Box>
        )
      case 2:
        return (
          <Box
            paddingTop={5}
            paddingBottom={5}
            marginBottom={5}
          >
            <SelfQuizResult
              questions={quizQuestions}
              topics={union(topics.covers, union(topics.mentions, topics.requires))}
              showCorrect={true}
            />
            <Box className={style.centeredSection} marginBottom={2}>
              <Button
                variant='contained'
                color='primary'
                onClick={e => startNewQuiz()}
              >
                <Typography variant='button' style={{ fontSize: 18 }}>
                  Take another quiz
                </Typography>
              </Button>
            </Box>
            <Box className={style.centeredSection}>
              <Button
                variant='outlined'
                color='primary'
                onClick={e => handleExit()}
              >
                <Typography variant='button' style={{ fontSize: 18 }}>
                  Close
                </Typography>
              </Button>
            </Box>
          </Box>
        )
    }
  }

return (
  <ThemeProvider theme={customTheme}>
    {loading ?
      <div style={{marginTop: 20}}>
        <Alert severity='success' icon={false}>
          Loading...
        </Alert>
      </div> :
      getContent()
    }
  </ThemeProvider>
)
}

export default SelfQuizNew
