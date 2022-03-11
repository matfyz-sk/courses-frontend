import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Step, StepLabel, Stepper, Switch, Tab, Tabs, Typography, } from '@material-ui/core'
import { Spinner } from 'reactstrap'
import { Alert } from '@material-ui/lab'
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs'
import { ThemeProvider } from '@material-ui/styles'
import ManualQuizAssignment from './manual-quiz-assignment'
import SelectedQuestions from './selected-questions'
import GeneralInfo from './general-info'
import { customTheme, useStyles } from '../../common/style/styles'
import QuizOverview from './quiz-overview'
import GenerateQuestionsSection from './generate-questions-section'
import { checkEndDateQA, checkTextNotEmpty, checkTimeLimitQA, } from '../../common/functions/validate-input'
import { createGenerationData, validateGenerationData, } from '../../common/functions/generation_functions'
import WarningMessage from '../../common/warning-message'
import {
  getAgentsData,
  getQuestionsData,
  getQuizAssignmentInfo,
  getTopicsData,
} from '../../common/functions/fetch-data-functions'
import {
  axiosAddEntity,
  axiosGetEntities,
  axiosUpdateEntity,
  getResponseBody,
  getShortID,
} from '../../../../helperFunctions'
import { grey } from '@material-ui/core/colors'
import { QuestionTypesEnums, QuizAssignmentTypesEnums } from '../../common/functions/type-enums'
import { union } from '../../common/functions/common-functions'

function intersection(a, b) {
  return a.filter((value) => b.map(val => {
    return val.id
  }).indexOf(value.id) !== -1);
}

function QuizAssignment({
                          courseInstanceId,
                          userId,
                          token,
                          match,
                          history,
                        }) {

  const style = useStyles()
  // General data
  const [ courseName, setCourseName ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ startDate, setStartDate ] = useState(new Date(new Date().setMinutes(Math.round((new Date().getMinutes() / 5) + 1) * 5)));
  const [ endDate, setEndDate ] = useState(new Date(new Date().setMinutes(Math.round((new Date().getMinutes() / 5) + 1) * 5)));
  const [ unlimitedTime, setUnlimitedTime ] = useState(true)
  const [ timeLimit, setTimeLimit ] = useState('')
  const [ agentsSelected, setAgentsSelected ] = useState([])
  const [ topicsSelected, setTopicsSelected ] = useState([])
  const [ selectedQuestions, setSelectedQuestions ] = useState([])

  //Options
  const [ agentOptionsUsers, setAgentOptionsUsers ] = useState([])
  const [ agentOptionsTeams, setAgentOptionsTeams ] = useState([])

  const [ topicOptionsCovered, setTopicOptionsCovered ] = useState([])
  const [ topicOptionsRequired, setTopicOptionsRequired ] = useState([])
  const [ topicOptionsMentions, setTopicOptionsMentions ] = useState([])

  const [ allQuestions, setAllQuestions ] = useState([])
  const [ availableQuestions, setAvailableQuestions ] = useState([])
  const [ questionsFetched, setQuestionsFetched ] = useState(false)

  const [ topicNotEmpty, setTopicsNotEmpty ] = useState([])

  //GENERATED QUIZ
  const [ generationDataManual, setGenerationDataManual ] = useState([])
  const [ generationDataGenerated, setGenerationDataGenerated ] = useState([])
  const [ warningGenerationManual, setWarningGenerationManual ] = useState('')
  const [ warningGenerationGenerated, setWarningGenerationGenerated ] = useState('')
  const [ pointsForGenerated, setPointsForGenerated ] = useState(1)
  const [ excludeEssay, setExcludeEssay ] = useState(false)

  //Additional info
  const [ pointsForAll, setPointsForAll ] = useState('1')
  const [ pointsSameForAll, setPointsSameForAll ] = useState(true)
  const [ shuffleQuizTake, setShuffleQuizTake ] = useState(false)
  const [ showResult, setShowResult ] = useState(false)
  const [ showQuestionResult, setShowQuestionResult ] = useState(false)

  const [ maxPositionSelected, setMaxPositionSelected ] = useState(0)

  const [ showWarning, setShowWarning ] = useState({
    title: '',
    startDate: '',
    endDate: '',
    timeLimit: '',
  })

  const [ loadingInfo, setLoadingInfo ] = useState({
    quizEdit: isEdit(),
  });

  const [ quizAssignmentMode, setQuizAssignmentMode ] = useState(
    QuizAssignmentTypesEnums.manualQuizAssignment);

  //STEPPER
  const [ activeStep, setActiveStep ] = useState(0);
  const steps = getSteps();


  // GET DATA
  function isEdit() {
    return !!match.params.quizAssignmentId
  }

  useEffect(() => {
    if(courseInstanceId && userId && token) {

      getCourseName(getShortID(courseInstanceId))
      const fetchData = async() => {
        let data = {}
        data.topics = await getTopicsData(getShortID(courseInstanceId))
        data.agents = await getAgentsData(getShortID(courseInstanceId))
        return data
      }

      const fetchQuestions = async() => {
        return await getQuestionsData(getShortID(courseInstanceId), changePoints)
      }
      const fetchQuizInfo = async() => {
        return await getQuizAssignmentInfo(match.params.quizAssignmentType, match.params.quizAssignmentId)

      }

      fetchData().then(data => {
        setTopicOptionsCovered(data.topics.covered)
        setTopicOptionsRequired(data.topics.required)
        setTopicOptionsMentions(data.topics.mentioned)
        setAgentOptionsUsers(data.agents.users)
        setAgentOptionsTeams(data.agents.teams)
        fetchQuestions().then(questions => {
          setAllQuestions(questions)
          setQuestionsFetched(true)
          if(isEdit())
            fetchQuizInfo().then(res => {
              getQuizAssignmentEdit(res, data.topics, questions)
            })
        })

      })

    }
  }, [ courseInstanceId, userId, token ])

  useEffect(() => {
    setAvailableQuestions(allQuestions.filter(question =>
      topicsSelected.map(topic => topic.id).indexOf(question.question.topic) !== -1
    ))
    setSelectedQuestions(prevState => prevState.filter(question =>
      topicsSelected.map(topic => topic.id).indexOf(question.question.topic) !== -1
    ))
    //TODO
    setTopicsNotEmpty(topicsSelected.filter(topic =>
      allQuestions.reduce((acc, question) =>
        question.question.topic === topic.id ? ++acc : acc, 0) > 0))
    setGenerationDataManual(createGenerationData(topicsSelected, allQuestions))
    setGenerationDataGenerated(prevState => prevState.concat(
      createGenerationData(topicsSelected, allQuestions).filter(topicG => !prevState.some(topic => topic.id === topicG.id))
    ))
  }, [ topicsSelected ])

  const getCourseName = (courseInstanceId) => {
    axiosGetEntities(`courseInstance/${ courseInstanceId }`)
      .then(response => {
        setCourseName(getResponseBody(response)[0].name)
      })
      .catch(error => console.log(error))
  }

  const getQuizAssignmentEdit = (quizInfo, allTopics, allQuestions) => {

    setQuizAssignmentMode(quizInfo.type === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
      QuizAssignmentTypesEnums.manualQuizAssignment : QuizAssignmentTypesEnums.generatedQuizAssignment
    )

    setTitle(quizInfo.title)
    setDescription(quizInfo.description)
    setStartDate(quizInfo.startDate)
    setEndDate(quizInfo.endDate)
    setShuffleQuizTake(quizInfo.shuffleQuestion)
    setPointsSameForAll(false)

    setUnlimitedTime(quizInfo.unlimitedTime)
    setTimeLimit(quizInfo.timeLimit)

    setShowResult(quizInfo.showResult)
    setShowQuestionResult(quizInfo.showQuestionResult)

    const topicsSelectedAll = union(union(
        allTopics.covered.filter(t => quizInfo.covers.map(q => {
          return q['@id']
        }).indexOf(t.id) !== -1),
        allTopics.required.filter(t => quizInfo.requires.map(q => {
          return q['@id']
        }).indexOf(t.id) !== -1)),
      allTopics.mentioned.filter(t => quizInfo.mentions.map(q => {
        return q['@id']
      }).indexOf(t.id) !== -1))

    setTopicsSelected(topicsSelectedAll)

    const selectedAgentsQT = quizInfo.agents.reduce((acc, user) => {
      acc.push({
        id: user['@id'],
        type: user['@type'],
        name: `${ user.firstName } ${ user.lastName }`,
      })
      return acc
    }, [])

    setAgentsSelected(selectedAgentsQT)

    //MANUAL
    if(quizInfo.type === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
      const quizTakePrototypeId = quizInfo.quizTakePrototypeId
      axiosGetEntities(`quizTakePrototype/${ getShortID(quizTakePrototypeId) }?_join=orderedQuestion`)
        .then(response => {
          const quizTakePrototype = getResponseBody(response)[0]
          const selectedQuestionsReduced = quizTakePrototype.orderedQuestion.reduce((acc, question) => {
            acc.push({
              question: allQuestions.find(q => q.question.id === question.question).question,
              points: question.points ? question.points : '1',
              position: question.position,
              changePoints: newPoints => changePoints(question.question, newPoints)
            })
            return acc
          }, [])
          const sortedSelectedQuestions = selectedQuestionsReduced.sort(
            (a, b) => {
              return a.position - b.position
            }
          )

          setMaxPositionSelected(sortedSelectedQuestions.length)
          setSelectedQuestions(sortedSelectedQuestions)
          setLoadingInfo(prevState => {
            return {...prevState, quizEdit: false}
          })
        })
        .catch(error => console.log(error))
    }
    //TODO GENERATED

    else {
      setPointsForGenerated(quizInfo.pointsPerQuestion)
      setExcludeEssay(quizInfo.excludeEssay)
      setGenerationDataGenerated(quizInfo.generationData)
      setLoadingInfo(prevState => {
        return {...prevState, quizEdit: false}
      })
    }
  }


  const changePoints = (id, points) => {
    setSelectedQuestions(prevState => prevState.map(q => {
      return q.question.id === id ? {...q, points} : q
    }))
  }

  const formSubmit = () => {

    const selectedAgentsIds = agentsSelected.map(agent => {
      return agent.id
    })

    const quizNewData = {
      name: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      timeLimit: unlimitedTime ? -1 : parseInt(timeLimit, 10),
      showResult: showResult,
      showQuestionResult: showQuestionResult,
      assignedTo: selectedAgentsIds,
      courseInstance: courseInstanceId,
    }

    let topicsUsed = []

    if(quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
      topicsUsed = topicNotEmpty.filter(topic => selectedQuestions.some(q => q.question.topic === topic.id))

      quizNewData.hasQuizTakePrototype = {
        orderedQuestion: selectedQuestions.reduce((acc, question) => {
          acc.push({
            question: question.question.id,
            position: question.position,
            points: parseInt(question.points, 10),
          })
          return acc
        }, [])
      }

      quizNewData.shuffleQuestion = shuffleQuizTake
      quizNewData.shuffleAnswer = false

    } else {
      quizNewData.pointsPerQuestion = pointsForGenerated
      quizNewData.excludeEssay = excludeEssay
      quizNewData.questionsAmount = generationDataGenerated[0].number

      if(generationDataGenerated[0].all) {
        topicsUsed = topicNotEmpty
        if(!generationDataGenerated[0].types[0].all) {
          quizNewData.hasTypeAppearance = generationDataGenerated[0].types.reduce((acc, type) => {
            if(type.id !== -1 && type.number > 0) {
              acc.push({
                questionsAmount: type.number,
                questionType: type.id,
              })
            }
            return acc
          }, [])
        }
      } else {
        quizNewData.hasTopicAppearance = generationDataGenerated.reduce((acc, topic) => {
          if(topic.id !== -1 && topic.number > 0) {
            topicsUsed.push(topic)
            if(topic.types[0].all) {
              acc.push({
                questionsAmount: topic.number,
                topic: topic.id,
              })
            } else {
              acc.push({
                questionsAmount: topic.number,
                topic: topic.id,
                hasTypeAppearance: topic.types.reduce((acc, type) => {
                  if(type.id !== -1 && type.number > 0) {
                    acc.push({
                      questionsAmount: type.number,
                      questionType: type.id,
                    })
                  }
                  return acc
                }, [])
              })
            }
          }
          return acc
        }, [])
      }
    }

    const topicsCoveredIds = intersection(topicsUsed, topicOptionsCovered).map(topic => {
      return topic.id
    })
    const topicsMentionedIds = intersection(topicsUsed, topicOptionsMentions).map(topic => {
      return topic.id
    })
    const topicsRequiredIds = intersection(topicsUsed, topicOptionsRequired).map(topic => {
      return topic.id
    })

    quizNewData.covers = topicsCoveredIds
    quizNewData.mentions = topicsMentionedIds
    quizNewData.requires = topicsRequiredIds

    if(!isEdit()) {
      axiosAddEntity(JSON.stringify(quizNewData), `${ quizAssignmentMode.middlename }`)
        .then(response => {
          if(response.response.status === 200)
            history.push(`/courses/${ match.params.courseId }/quiz/quizAssignmentsOverview`)
        })
        .catch(error => console.log(error))
    } else {
      axiosUpdateEntity(JSON.stringify(quizNewData), `${ quizAssignmentMode.middlename }/${ match.params.quizAssignmentId }`)
        .then(response => {
          if(response.response.status === 200)
            history.push(`/courses/${ match.params.courseId }/quiz/quizAssignmentsOverview`)
        })
        .catch(error => console.log(error))
    }
  }

  const validateOnSubmit = () => {
    if(checkTextNotEmpty(title, "") === 'ok' &&
      checkEndDateQA(new Date(startDate), new Date(endDate)) === 'ok' &&
      checkTimeLimitQA(timeLimit, unlimitedTime) === 'ok')
      formSubmit()
    else {
      setShowWarning(prevState => {
        return ({...prevState, title: checkTextNotEmpty(title, 'Title')})
      })
      setShowWarning(prevState => {
        return ({...prevState, endDate: checkEndDateQA(new Date(startDate), new Date(endDate))})
      })
      setShowWarning(prevState => {
        return ({...prevState, timeLimit: checkTimeLimitQA(timeLimit, unlimitedTime)})
      })
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  const handleModeChange = (event, newValue) => {
    setQuizAssignmentMode(newValue)
  }

  const handleNext = () => {
    if(activeStep === 2) validateOnSubmit()
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      window.scrollTo({top: 150, behavior: 'auto'})
    }
  };

  const handleBack = () => {
    if(activeStep === 2) setShowWarning({
      title: '',
      startDate: '',
      endDate: '',
      timeLimit: '',
    })
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    window.scrollTo({top: 150, behavior: 'auto'})
  };

  function getSteps() {
    return [ 'General', 'Questions', 'Overview' ];
  }

  const getSettingsRow = (option, description, checked, checkFunction) => {
    const optionTextWidth = '25%'
    const optionSwitchWidth = '10%'
    return (
      <Box padding={ 1 } paddingLeft={ 2 } display='flex' alignItems='center'>
        <Box width={ optionTextWidth }>
          <Typography variant='button'>{ option }</Typography>
        </Box>
        <Box width={ optionSwitchWidth }>
          <Switch
            disabled={
              option === "Show total score" &&
              (quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
                selectedQuestions.some(question => question.question.questionType === QuestionTypesEnums.essay.id)
                :
                !excludeEssay)
            }
            checked={ checked }
            color='primary'
            onChange={ e => checkFunction(prev => !prev) }
          />
        </Box>
        <Typography style={ {marginLeft: 24, color: `${ customTheme.palette.text.secondary }`} }>
          <em>{ description }</em>
        </Typography>
      </Box>
    )
  }

  function getQuizSettings() {
    return (
      <div className={ style.sectionRoot }>
        <Typography
          className={ `${ style.sectionHeader } ${ style.startSection }` }
          variant='h6'
          style={ {borderBottom: `2px solid ${ customTheme.palette.primary.main }`} }
        > Quiz settings</Typography>
        <Box style={ {
          backgroundColor: `${ grey[50] }`,
          border: 0,
          borderBottom: `2px solid ${ customTheme.palette.primary.main }`,
        } } display='block'>
          { quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id && getSettingsRow(
            "Shuffle quiz take",
            "Questions will be shown in random order for each quiz take",
            shuffleQuizTake,
            setShuffleQuizTake,
          ) }
          <Typography
            className={ `${ style.sectionHeader } ${ style.startSection }` }
            variant='h6'
            style={ {fontSize: 18} }
          >
            Result page
          </Typography>
          { getSettingsRow(
            "Show total score",
            "Available for quizzes without essay questions",
            showResult,
            setShowResult,
          ) }
          { getSettingsRow(
            "Show result for questions",
            "Correct / incorrect marks for questions",
            showQuestionResult,
            setShowQuestionResult,
          ) }
        </Box>
      </div>
    )
  }

  const getStepContent = (stepIndex) => {
    switch(stepIndex) {
      case 0:
        return (
          <div className={ style.sectionRoot }>
            <GeneralInfo
              courseName={ courseName }
              title={ title }
              setTitle={ setTitle }
              description={ description }
              setDescription={ setDescription }
              startDate={ startDate }
              setStartDate={ setStartDate }
              endDate={ endDate }
              setEndDate={ setEndDate }
              unlimitedTime={ unlimitedTime }
              setUnlimitedTime={ setUnlimitedTime }
              timeLimit={ timeLimit }
              setTimeLimit={ setTimeLimit }
              agentOptionsUsers={ agentOptionsUsers }
              agentOptionsTeams={ agentOptionsTeams }
              agentsSelected={ agentsSelected }
              setAgentsSelected={ setAgentsSelected }
              topicsSelected={ topicsSelected }
              setTopicsSelected={ setTopicsSelected }
              topicOptionsCovered={ topicOptionsCovered }
              topicOptionsRequired={ topicOptionsRequired }
              topicOptionsMentions={ topicOptionsMentions }
              loadedQuestions={ questionsFetched }
            />
          </div>
        );
      case 1:
        return (
          <div>
            { !isEdit() && <Tabs
              value={ quizAssignmentMode }
              onChange={ handleModeChange }
              variant='fullWidth'
              className={ style.sectionRoot }
              TabIndicatorProps={ {style: {top: 0}} }
              indicatorColor='primary'
            >
              <Tab
                value={ QuizAssignmentTypesEnums.manualQuizAssignment }
                className={ quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
                  style.modeTabSelected : style.modeTab }
                label={
                  <Typography style={ {textTransform: 'capitalize'} } variant='h6'>
                    { QuizAssignmentTypesEnums.manualQuizAssignment.name }
                  </Typography>
                }
              />
              <Tab
                value={ QuizAssignmentTypesEnums.generatedQuizAssignment }
                className={ quizAssignmentMode.id === QuizAssignmentTypesEnums.generatedQuizAssignment.id ?
                  style.modeTabSelected : style.modeTab }
                label={
                  <Typography style={ {textTransform: 'capitalize'} } variant='h6'>
                    { QuizAssignmentTypesEnums.generatedQuizAssignment.name }
                  </Typography>
                }
              />
            </Tabs> }
            { quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
              <div>
                <ManualQuizAssignment
                  topicsSelected={ topicNotEmpty }
                  availableQuestions={ availableQuestions }
                  selectedQuestions={ selectedQuestions }
                  setSelectedQuestions={ setSelectedQuestions }
                  pointsForAll={ pointsForAll }
                  maxPositionSelected={ maxPositionSelected }
                  setMaxPositionSelected={ setMaxPositionSelected }
                  isEdit={ isEdit() }
                  generationData={ generationDataManual }
                  setGenerationData={ setGenerationDataManual }
                  warningGeneration={ warningGenerationManual }
                  setWarningGeneration={ setWarningGenerationManual }
                  excludeEssay={ excludeEssay }
                  setExcludeEssay={ setExcludeEssay }
                />
                <SelectedQuestions
                  selectedQuestions={ selectedQuestions }
                  setSelectedQuestions={ setSelectedQuestions }
                  pointsForAll={ pointsForAll }
                  setPointsForAll={ setPointsForAll }
                  pointsSameForAll={ pointsSameForAll }
                  setPointsSameForAll={ setPointsSameForAll }
                  shuffleQuizTake={ shuffleQuizTake }
                  setShuffleQuizTake={ setShuffleQuizTake }
                  setMaxPositionSelected={ setMaxPositionSelected }
                  setShowResult={ setShowResult }
                />
                { getQuizSettings() }
              </div>
              :
              <div>
                <GenerateQuestionsSection
                  topicsSelected={ topicNotEmpty }
                  availableQuestions={ availableQuestions }
                  generationData={ generationDataGenerated }
                  setGenerationData={ setGenerationDataGenerated }
                  setWarningGeneration={ setWarningGenerationGenerated }
                  quizMode={ quizAssignmentMode }
                  pointsForGenerated={ pointsForGenerated }
                  setPointsForGenerated={ setPointsForGenerated }
                  excludeEssay={ excludeEssay }
                  setExcludeEssay={ setExcludeEssay }
                />
                <Box display='flex' marginBottom={ 2 } justifyContent='center'>
                  <WarningMessage
                    text={ warningGenerationGenerated }
                  />
                </Box>
                { getQuizSettings() }
              </div>
            }

          </div>
        )
      case 2:
        return (
          <div className={ style.sectionRoot }>
            <QuizOverview
              title={ title }
              description={ description }
              startDate={ startDate }
              endDate={ endDate }
              timeLimit={ unlimitedTime ? -1 : timeLimit }
              topics={ topicsSelected }
              agents={ agentsSelected }
              questions={ selectedQuestions }
              shuffleQuizTake={ shuffleQuizTake }
              showResult={ showResult }
              showQuestionResult={ showQuestionResult }
              agentOptionsUsers={ agentOptionsUsers }
              agentOptionsTeams={ agentOptionsTeams }
              agentsSelected={ agentsSelected }
              topicsSelected={ topicsSelected }
              topicOptionsCovered={ topicOptionsCovered }
              topicOptionsRequired={ topicOptionsRequired }
              topicOptionsMentions={ topicOptionsMentions }
              showWarning={ showWarning }
              quizAssignmentMode={ quizAssignmentMode }
              generationData={ generationDataGenerated }
              pointsForGenerated={ pointsForGenerated }
            />
          </div>
        )
      default:
        return 'Unknown stepIndex';
    }
  }

  const root = () => {
    return (
      <Paper variant='outlined' className={ style.root }>
        <h2>Quiz assignment</h2>
        { loadingInfo.quizEdit ?
          <div style={ {marginTop: 20} }>
            <Alert severity='success' icon={ false }>
              Loading...
            </Alert>
          </div>
          :
          <div>
            <Stepper
              activeStep={ activeStep }
              className={ `${ style.smDownDisplayNone } ${ style.sectionRoot }` }
            >
              { steps.map((label) => (
                <Step key={ label }>
                  <StepLabel
                    StepIconProps={ {classes: {root: style.stepIcon}} } classes={ {label: style.stepLabel} }>{ label }
                  </StepLabel>
                </Step>
              )) }
            </Stepper>

            { getStepContent(activeStep) }
            <Box className={ style.centeredSection }>
              { activeStep > 0 &&
                <Button
                  className={ style.navButton }
                  variant='contained'
                  size='large'
                  color='primary'
                  onClick={ handleBack }
                  startIcon={ <BsCaretLeftFill/> }
                >
                  { getSteps()[activeStep - 1] }
                </Button> }
              <Button
                className={ style.navButton }
                variant='contained'
                size='large'
                color='primary'
                disabled={ activeStep === 0 && !questionsFetched }
                onClick={ e =>
                  activeStep === 1 && quizAssignmentMode.id === QuizAssignmentTypesEnums.generatedQuizAssignment.id ?
                    validateGenerationData(generationDataGenerated, setWarningGenerationGenerated) && handleNext() : handleNext()
                }
                endIcon={
                  activeStep === 0 && !questionsFetched || activeStep === getSteps().length - 1 ? null :
                    <BsCaretRightFill/>
                }
              >
                { activeStep === 0 && !questionsFetched ?
                  <Spinner color='light'/>
                  :
                  activeStep === getSteps().length - 1 ? isEdit() ? 'EDIT QUIZ' : 'CREATE QUIZ' : getSteps()[activeStep + 1]
                }
              </Button>
            </Box>
          </div> }
      </Paper>
    )

  }

  return (
    <ThemeProvider theme={ customTheme }>
      { root() }
    </ThemeProvider>
  )
}

export default QuizAssignment
