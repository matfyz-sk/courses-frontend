import React, {useEffect, useState} from 'react'
import {API_URL} from '../../../../configuration/api'
import axios from 'axios'
import {Box, Button, Paper, Step, StepLabel, Stepper, Tab, Tabs,} from '@material-ui/core'
import {Alert} from "@material-ui/lab";
import {BsCaretLeftFill, BsCaretRightFill} from 'react-icons/bs'
import {ThemeProvider,} from '@material-ui/styles'
import ManualQuizAssignment from './manual-quiz-assignment'
import SelectedQuestions from './selected-questions'
import GeneralInfo from './general-info'
import {theme, useStyles} from '../../common/styles'
import setAnswers from '../../common/set-answers'
import QuizOverview from "./quiz-overview";
import GenerateQuestionsSection from "./generate-questions-section";
import {checkEndDateQA, checkTextNotEmpty, checkTimeLimitQA} from "../../common/validate-input";

const enText = {
  'manual-quiz-assignment': 'Manual quiz assignment',
  'generated-quiz-assignment': 'Generated quiz assignment',
}

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export const QuizAssignmentTypesEnums = Object.freeze({
  manualQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#ManualQuizAssignment',
    middlename: 'manualQuizAssignment',
    name: enText['manual-quiz-assignment'],
  },
  generatedQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#GeneratedQuizAssignment',
    middlename: 'generatedQuizAssignment',
    name: enText['generated-quiz-assignment'],
  },
})

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function QuizAssignment({
                          courseInstanceId,
                          userId,
                          isTeacher,
                          token,
                          match,
                          history,
                        }) {

  const style = useStyles()

  // General data
  const [courseName, setCourseName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(new Date(new Date().setMinutes(Math.round((new Date().getMinutes() / 5) + 1) * 5)));
  const [endDate, setEndDate] = useState(new Date(new Date().setMinutes(Math.round((new Date().getMinutes() / 5) + 1) * 5)));
  const [unlimitedTime, setUnlimitedTime] = useState(false)
  const [timeLimit, setTimeLimit] = useState('')
  const [agentsSelected, setAgentsSelected] = useState([])
  const [topicsSelected, setTopicsSelected] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState( [])

  //Options
  const [agentOptionsUsers, setAgentOptionsUsers] = useState([])
  const [agentOptionsTeams, setAgentOptionsTeams] = useState([])

  const [topicOptionsCovered, setTopicOptionsCovered] = useState([])
  const [topicOptionsRequired, setTopicOptionsRequired] = useState([])
  const [topicOptionsMentions, setTopicOptionsMentions] = useState([])

  const [allQuestions, setAllQuestions] = useState([])
  const [availableQuestions, setAvailableQuestions] = useState([])

  //Additional info
  const [pointsForAll, setPointsForAll] = useState('1')
  const [pointsSameForAll, setPointsSameForAll] = useState(true)
  const [shuffleQuizTake, setShuffleQuizTake] = useState(false)
  const [maxPositionSelected, setMaxPositionSelected] = useState(0)

  const [showWarning, setShowWarning] = useState({
    title: '',
    startDate: '',
    endDate: '',
    timeLimit: '',
  })

  const [loadingInfo, setLoadingInfo] = useState({
    quizEdit: isEdit(),
  });

  const [quizAssignmentMode, setQuizAssignmentMode] = useState(
    QuizAssignmentTypesEnums.manualQuizAssignment);
  const [quizModeTab, setQuizModeTab] = useState(
    QuizAssignmentTypesEnums.manualQuizAssignment.id);

  //STEPPER
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  // GET DATA
  function isEdit () {
    return !!match.params.quizAssignmentId
  }

  useEffect( () => {
    if (courseInstanceId && userId && token) {
      getCourseName(courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token)
      getTopics(courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token)
      getQuestions(courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token)
      getAgents(courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token)
    }
  },[courseInstanceId, userId, token])

  useEffect(() => {
    if (isEdit()) {
      const { quizAssignmentType, quizAssignmentId } = match.params
      if (quizAssignmentType && quizAssignmentId)
        getQuizAssignment(quizAssignmentType, quizAssignmentId, token)
    }
  },[allQuestions,topicOptionsCovered, topicOptionsMentions, topicOptionsRequired])

  useEffect(() => {
    setAvailableQuestions(allQuestions.filter(question =>
      topicsSelected.map(topic => {
        return topic.id
      }).indexOf(question.question.topic) !== -1
    ))
    setSelectedQuestions(prevState => prevState.filter(question =>
      topicsSelected.map(topic => {
        return topic.id
      }).indexOf(question.question.topic) !== -1
    ))
  },[topicsSelected])

  const getCourseName = (courseInstanceId, token) => {
    axios
      .get(`${API_URL}/courseInstance/${courseInstanceId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
      .then(({data} ) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ){
          setCourseName(data['@graph'][0].name)
        }
      })
      .catch(error => console.log(error))
  }

  const getTopics = (courseInstanceId, token) => {
    axios.all([
      axios.get(`${API_URL}/topic?covers=${courseInstanceId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }),
      axios.get(`${API_URL}/topic?requires=${courseInstanceId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }),
      axios.get(`${API_URL}/topic?mentions=${courseInstanceId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
    ])
      .then(([topicsCovered, topicsRequired, topicsMentioned]) => {
        if (
          topicsCovered.data &&
          topicsCovered.data['@graph'] &&
          topicsCovered.data['@graph'].length > 0
        ) {
          const topicsCoveredMapped = topicsCovered.data['@graph'].reduce(
            (acc,topicData) => {
              if (topicData && topicData['@id'] && topicData.name) {
                acc.push({
                  id: topicData['@id'],
                  name: topicData.name,
                })
              }
              return acc
            },[]
          )
          setTopicOptionsCovered(topicsCoveredMapped)
        }
        if (
          topicsRequired.data &&
          topicsRequired.data['@graph'] &&
          topicsRequired.data['@graph'].length > 0
        ) {
          const topicsRequiredMapped = topicsRequired.data['@graph'].reduce(
            (acc,topicData) => {
              if (topicData && topicData['@id'] && topicData.name) {
                acc.push({
                  id: topicData['@id'],
                  name: topicData.name,
                })
              }
              return acc
            },[]
          )
          setTopicOptionsRequired(topicsRequiredMapped)
        }
        if (
          topicsMentioned.data &&
          topicsMentioned.data['@graph'] &&
          topicsMentioned.data['@graph'].length > 0
        ) {
          const topicsMentionedMapped = topicsMentioned.data['@graph'].reduce(
            (acc,topicData) => {
              if (topicData && topicData['@id'] && topicData.name) {
                acc.push({
                  id: topicData['@id'],
                  name: topicData.name,
                })
              }
              return acc
            },[]
          )
          setTopicOptionsMentions(topicsMentionedMapped)
        }
      })
      .catch(error => console.log(error))}

  const getQuestions = (courseInstanceId, token) => {
    axios
      .get(
        `${API_URL}/question?approver=iri&courseInstance=${courseInstanceId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(res => res.data)
      .then(data => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ){
          const questionsWithAnswers = data['@graph'].reduce( (acc, questionData) => {
            const questionFullId = questionData['@id']
            const questionId = questionFullId.substr(
              questionFullId.lastIndexOf('/') + 1
            )
            const questionType = questionFullId.substring(
              questionFullId.lastIndexOf('/', questionFullId.lastIndexOf('/') - 1) + 1,
              questionFullId.lastIndexOf('/')
            )
            axios
              .get(
                `${API_URL}/${questionType}/${questionId}?_join=hasAnswer`,
                {
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token,
                  },
                }
              )
              .then(res => res.data)
              .then(data => {
                const questionData = data['@graph'][0]
                const question = {
                  id: questionData['@id'],
                  title: questionData.name,
                  questionText: questionData.text,
                  topic: questionData.ofTopic[0]['@id'],
                  questionType: questionData['@type'],
                  createdBy: questionData.createdBy,
                  createdAt: new Date(questionData.createdAt),
                }
                acc.push({
                  question: setAnswers(question,questionData),
                  points: pointsForAll,
                  position: -1,
                  changePoints: newPoints => changePoints(question.id, newPoints)
                })
              })
              .catch(error => console.log(error))

            return acc
          },[])
          setAllQuestions(questionsWithAnswers)
          setLoadingInfo(prevState => {return {...prevState, allQuestions: false}})
        }
      })
      .catch(error => console.log(error))
  }
  const getAgents = (courseInstanceId, token) => {
    axios.all([
      axios.get(`${API_URL}/user?studentOf=${courseInstanceId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }),
      axios.get(`${API_URL}/team?courseInstance=${courseInstanceId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })]
    ).then(([userAgents, teamAgents]) => {
      if (
        userAgents &&
        userAgents.data &&
        userAgents.data['@graph'] &&
        userAgents.data['@graph'].length &&
        userAgents.data['@graph'].length > 0
      ){
        const usersData =  userAgents.data['@graph']
        const agentUsers = usersData.reduce((acc,user) => {
          if (user['@type'] === "http://www.courses.matfyz.sk/ontology#User"){
            acc.push({
              id: user['@id'],
              type: user['@type'],
              name: `${user.firstName} ${user.lastName}`,
            })
          }
          return acc
        },[])
        setAgentOptionsUsers(agentUsers)
      }
      if (
        teamAgents &&
        teamAgents.data &&
        teamAgents.data['@graph'] &&
        teamAgents.data['@graph'].length &&
        teamAgents.data['@graph'].length > 0
      ){
        const teamsData = teamAgents.data['@graph']
        const agentTeams = teamsData.reduce((acc,team) => {
          if (team['@type'] === "http://www.courses.matfyz.sk/ontology#Team"){
            acc.push({
              id: team['@id'],
              type: team['@type'],
              name: team.name,
            })
          }
          return acc
        },[])
        setAgentOptionsTeams(agentTeams)
      }
    })
      .catch(error => console.log(error))
  }

  const getQuizAssignment = (quizAssignmentType, quizAssignmentId, token) => {
    let join = ''
    if (
      quizAssignmentType ===
      QuizAssignmentTypesEnums.manualQuizAssignment.middlename
    ) {
      join = 'hasQuizTakePrototype'
    } else if (
      quizAssignmentType ===
      QuizAssignmentTypesEnums.generatedQuizAssignment.middlename
    ) {
      join = 'hasTopicAppearance'
    }
    axios
      .get(
        `${API_URL}/${quizAssignmentType}/${quizAssignmentId}?_join=${join},assignedTo`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const quizAssignment = data['@graph'][0]

          setTitle(quizAssignment.name)
          setDescription(quizAssignment.description)
          setStartDate(quizAssignment.startDate)
          setEndDate(quizAssignment.endDate)
          setShuffleQuizTake(quizAssignment.shuffleQuestion)
          setPointsSameForAll(false)
          if (quizAssignment.timeLimit) setTimeLimit(quizAssignment.timeLimit)
          else {
            setTimeLimit('')
            setUnlimitedTime(true)
          }

          //TODO delete when new quizzes
          if (quizAssignment.covers.length === 0 &&
            quizAssignment.requires.length === 0 &&
            quizAssignment.mentions.length === 0
          ) {
            setTopicsSelected(topicOptionsCovered)
          } else {
            const topicsS = union(union(
              topicOptionsCovered.filter(t => quizAssignment.covers.map( q => {return q['@id']}).indexOf(t.id) !== -1),
              topicOptionsRequired.filter(t => quizAssignment.requires.map( q => {return q['@id']}).indexOf(t.id) !== -1)),
              topicOptionsMentions.filter(t => quizAssignment.mentions.map( q => {return q['@id']}).indexOf(t.id) !== -1))

            setTopicsSelected(topicsS)
          }

          const selectedAgentsQT = quizAssignment.assignedTo.reduce((acc,user) => {
            acc.push({
              id: user['@id'],
              type: user['@type'],
              name: `${user.firstName} ${user.lastName}`,
            })
            return acc
          },[])

          setAgentsSelected(selectedAgentsQT)

          //MANUAL
          if (quizAssignment['@type'] === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
            if (
              quizAssignment.hasQuizTakePrototype &&
              quizAssignment.hasQuizTakePrototype.length
            ) {
              const quizTakePrototypeId = quizAssignment.hasQuizTakePrototype[0]['@id']
              axios
                .get(
                  `${API_URL}/quizTakePrototype/${quizTakePrototypeId.substring(
                    quizTakePrototypeId.lastIndexOf('/') + 1)}?_join=orderedQuestion`,
                  {
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: token,
                    },
                  }
                )
                .then(({data: dataQuizTakePrototype}) => {
                  if (
                    dataQuizTakePrototype &&
                    dataQuizTakePrototype['@graph'] &&
                    dataQuizTakePrototype['@graph'].length &&
                    dataQuizTakePrototype['@graph'].length > 0
                  ) {
                    const quizTakePrototype = dataQuizTakePrototype['@graph'][0]

                    const selectedQuestionsReduced = quizTakePrototype.orderedQuestion.reduce((acc,question) => {
                      acc.push({
                        question: allQuestions.find(q => q.question.id === question.question).question ,
                        points: question.points ? question.points : pointsForAll,
                        position: question.position,
                        changePoints: newPoints => changePoints(question.question, newPoints)
                      })
                      return acc
                    },[])
                    const sortedSelectedQuestions = selectedQuestionsReduced.sort(
                      (a, b) => {return a.position - b.position}
                    )

                    setMaxPositionSelected(sortedSelectedQuestions.length)
                    setSelectedQuestions(sortedSelectedQuestions)
                    setLoadingInfo(prevState => {return {...prevState, quizEdit: false}})

                  }
                })
                .catch(error => console.log(error))
            }
          }

        }
      })
      .catch(error => console.log(error))
  }

  const formSubmit = () => {

    const selectedAgentsIds = agentsSelected.map(agent => {return agent.id})
    const topicsCoveredIds = intersection(topicsSelected, topicOptionsCovered).map(topic => {return topic.id})
    const topicsMentionedIds = intersection(topicsSelected, topicOptionsMentions).map(topic => {return topic.id})
    const topicsRequiredIds = intersection(topicsSelected, topicOptionsRequired).map(topic => {return topic.id})

    //TODO time limit
    const quizNewData = {
      name: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      assignedTo: selectedAgentsIds,
      courseInstance: courseInstanceId,
      shuffleQuestion: shuffleQuizTake,
      shuffleAnswer: false,
      covers: topicsCoveredIds,
      mentions: topicsMentionedIds,
      requires: topicsRequiredIds,
    }

    if (quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
      quizNewData.hasQuizTakePrototype = {
        orderedQuestion: selectedQuestions.reduce((acc, question) => {
          acc.push({
            question: question.question.id,
            position: question.position,
            points: parseInt(question.points,10),
          })
          return acc
        }, [])
      }
    }

    axios
      .post(`${API_URL}/${quizAssignmentMode.middlename}`, JSON.stringify(quizNewData), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ status: statusQuestionAssignment }) => {
        if (statusQuestionAssignment === 200) {
          if (isEdit()) {
            const { quizAssignmentType, quizAssignmentId } = match.params
            axios
              .delete(`${API_URL}/${quizAssignmentType}/${quizAssignmentId}`, {
                headers: {
                  Authorization: token,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              })
              .then(({ status: statusQuestionAssignmentDelete }) => {
                if (statusQuestionAssignmentDelete === 200) {
                  history.push(
                    `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`
                  )
                }
              })
              .catch(error => console.log(error))
          } else {
            history.push(
              `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`
            )
          }
        }
      })
      .catch(error => console.log(error))
  }

  const validateOnSubmit = () => {
    if (checkTextNotEmpty(title,"") === 'ok' &&
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
      window.scrollTo({top:0, behavior: 'smooth'})
    }
  }

  const changePoints = (id, points) => {
    setSelectedQuestions(prevState => prevState.map(q => {
      return q.question.id === id ? {...q, points} : q
    }))
  }

  const handleModeChange = (event, newValue) => {
    setQuizModeTab(newValue)
  }

  const handleNext = () => {
    if (activeStep === 2) validateOnSubmit()
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      window.scrollTo({top:150, behavior: 'auto'})
    }
  };

  const handleBack = () => {
    if (activeStep === 2) setShowWarning({
      title: '',
      startDate: '',
      endDate: '',
      timeLimit: '',
    })
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    window.scrollTo({top:150, behavior: 'auto'})
  };

  function getSteps() {
    return ['General', 'Questions', 'Overview'];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div className={style.sectionRoot}>
            <GeneralInfo
              courseName = {courseName}
              title = {title}
              setTitle = {setTitle}
              description = {description}
              setDescription = {setDescription}
              startDate = {startDate}
              setStartDate = {setStartDate}
              endDate = {endDate}
              setEndDate = {setEndDate}
              unlimitedTime = {unlimitedTime}
              setUnlimitedTime = {setUnlimitedTime}
              timeLimit = {timeLimit}
              setTimeLimit = {setTimeLimit}
              agentOptionsUsers = {agentOptionsUsers}
              agentOptionsTeams = {agentOptionsTeams}
              agentsSelected = {agentsSelected}
              setAgentsSelected = {setAgentsSelected}
              topicsSelected = {topicsSelected}
              setTopicsSelected = {setTopicsSelected}
              topicOptionsCovered = {topicOptionsCovered}
              topicOptionsRequired = {topicOptionsRequired}
              topicOptionsMentions = {topicOptionsMentions}
              loadingInfo = {loadingInfo}
              showWarning = {showWarning}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Tabs
              value={quizModeTab}
              onChange={handleModeChange}
              variant = 'fullWidth'
              className={style.sectionRoot}
              indicatorColor='primary'
            >
              <Tab
                className={style.QA_tabs}
                value={QuizAssignmentTypesEnums.manualQuizAssignment.id}
                label={
                  <h5 className='mb-0'>{QuizAssignmentTypesEnums.manualQuizAssignment.name}</h5>
                }
              />
              <Tab
                className={style.QA_tabs}
                value = {QuizAssignmentTypesEnums.generatedQuizAssignment.id}
                label={
                  <h5 className='mb-0'>{QuizAssignmentTypesEnums.generatedQuizAssignment.name}</h5>
                }
              />
            </Tabs>
            {quizModeTab === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
              <div>
                <ManualQuizAssignment
                  topicsSelected = {topicsSelected}
                  availableQuestions = {availableQuestions}
                  selectedQuestions = {selectedQuestions}
                  setSelectedQuestions = {setSelectedQuestions}
                  pointsForAll={pointsForAll}
                  maxPositionSelected={maxPositionSelected}
                  setMaxPositionSelected = {setMaxPositionSelected}
                  isEdit={isEdit()}
                />
                <SelectedQuestions
                  selectedQuestions = {selectedQuestions}
                  setSelectedQuestions = {setSelectedQuestions}
                  pointsForAll = {pointsForAll}
                  setPointsForAll = {setPointsForAll}
                  pointsSameForAll = {pointsSameForAll}
                  setPointsSameForAll = {setPointsSameForAll}
                  shuffleQuizTake = {shuffleQuizTake}
                  setShuffleQuizTake = {setShuffleQuizTake}
                  setMaxPositionSelected = {setMaxPositionSelected}
                  topicsSelected={topicsSelected}
                />
              </div>
              :
              <div/>
              // <GenerateQuestionsSection
              //   topicsSelected={topicsSelected}
              //   availableQuestions={availableQuestions}
              // />
            }

          </div>
        )
      case 2:
        return (
          <div className={style.sectionRoot}>
            <QuizOverview
              title={title}
              description = {description}
              startDate={startDate}
              endDate={endDate}
              timeLimit={unlimitedTime ? -1 : timeLimit}
              topics={topicsSelected}
              agents={agentsSelected}
              questions={selectedQuestions}
              shuffleQuizTake = {shuffleQuizTake}
              agentOptionsUsers = {agentOptionsUsers}
              agentOptionsTeams = {agentOptionsTeams}
              agentsSelected = {agentsSelected}
              topicsSelected = {topicsSelected}
              topicOptionsCovered = {topicOptionsCovered}
              topicOptionsRequired = {topicOptionsRequired}
              topicOptionsMentions = {topicOptionsMentions}
              showWarning={showWarning}
            />
          </div>
        )
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <Paper variant='outlined' className={style.root} >
      <ThemeProvider theme={theme}>
        <h2>Quiz assignment</h2>
        {loadingInfo.quizEdit ?
          <div style={{marginTop: 20}}>
            <Alert severity='success' icon={false}>
              Loading...
            </Alert>
          </div>
          :
          <div>
            <Stepper
              activeStep={activeStep}
              className={`${style.smDownDisplayNone} ${style.sectionRoot}`}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{classes: {root: style.QA_stepIcon}}} classes={{label: style.QA_stepLabel}}>{label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {getStepContent(activeStep)}
            <Box className = {style.QA_navButtons}>
              {activeStep > 0 &&
              <Button
                className = {style.QA_navButton}
                variant= 'contained'
                size = 'large'
                color= 'primary'
                onClick = {handleBack}
                startIcon={<BsCaretLeftFill/>}
              >
                {getSteps()[activeStep-1]}
              </Button>}
              <Button
                className = {style.QA_navButton}
                variant= 'contained'
                size = 'large'
                color= 'primary'
                onClick = {handleNext}
                endIcon={
                  activeStep === getSteps().length -1 ? null : <BsCaretRightFill/>
                }
              >
                {activeStep === getSteps().length -1 ? isEdit() ? 'Edit quiz' : 'Create quiz' : getSteps()[activeStep+1]}
              </Button>
            </Box>
          </div>}
      </ThemeProvider>
    </Paper>
  )
}

export default QuizAssignment
