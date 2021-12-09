import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { useStyles } from '../../common/style/styles'
import { QuestionTypesEnums, QuizAssignmentTypesEnums } from '../../common/functions/type-enums'
import { BsDashSquareFill, BsPlusSquareFill, FaAngleLeft, FaAngleRight } from 'react-icons/all'
import { grey } from '@material-ui/core/colors'

function GenerateQuestionsSection({
                                    topicsSelected,
                                    availableQuestions,
                                    generationData,
                                    setGenerationData,
                                    setWarningGeneration,
                                    quizMode,
                                    pointsForGenerated,
                                    setPointsForGenerated,
                                    excludeEssay,
                                    setExcludeEssay,
                                  }) {
  const style = useStyles()

  const [openedSection, setOpenedSection] = useState(null)
  const [questions, setQuestions] = useState(availableQuestions)

  useEffect(() => setQuestions(availableQuestions) ,[availableQuestions])

  const allTopicsTopic = {name: 'All topics', id: -1}
  const anyType = {name: 'Any type', id: -1}

  useEffect(() => {
    setWarningGeneration('')
  },[generationData])

  useEffect(() => {
    if (excludeEssay) {
      const filteredQuestions = availableQuestions.filter(question => question.question.questionType !== QuestionTypesEnums.essay.id)
      setQuestions(filteredQuestions)
      const newGenerationData = [...generationData]
      newGenerationData.map((topic,index) => {
        const essayIndex = topic.types.map(type => type.id).indexOf(QuestionTypesEnums.essay.id)
        const numOfTopic = index === 0 ? filteredQuestions.length : filteredQuestions.reduce((acc,question) => question.question.topic === topic.id ? ++acc : acc, 0)

        topic.types[essayIndex].number = 0
        if (topic.types[0].all && topic.types[0].number > numOfTopic) topic.types[0].number = numOfTopic
      })
      recountGenerationData(newGenerationData)
      setGenerationData(newGenerationData)
    }
    else setQuestions(availableQuestions)
  },[excludeEssay])

  const handleOpenSection = (section) => {
    setOpenedSection(section)
  }

  const clearTopicTypes = (newGenData, topicIndex, all) => {
    newGenData[topicIndex].types.map(type => {
      if (type.id !== -1) type.number = 0
    })
    newGenData[topicIndex].types[0].all = all
  }

  const recountGenerationData = (newGenData) => {
    newGenData.map(topic => {
      if (!topic.types[0].all) topic.types[0].number  =
        topic.types.reduce((acc,type) => type.number === "" || type.id === -1? acc : acc+type.number ,0)
      topic.number = topic.types[0].number
    })
    newGenData[0].number = newGenData.reduce((acc,topic) => topic.id !== -1 ? acc+topic.number : acc,0)
  }

  const handleAllTopics = () => {
    let newGenData = [...generationData]
    newGenData.map((topic, index) => {
      clearTopicTypes(newGenData, index, true)
      newGenData[index].types[0].number = 0
    })
    recountGenerationData(newGenData)
    newGenData[0].all = !newGenData[0].all
    setGenerationData(newGenData)
  }

  const handleAnyType = (topic, topicIndex) => {
    let newGenData = [...generationData]
    clearTopicTypes(newGenData, topicIndex, !newGenData[topicIndex].types[0].all)
    recountGenerationData(newGenData)
    setGenerationData(newGenData)
  }

  const optimizeEmptyNumber = (event, topicIndex, typeIndex) => {
    const newValue = event.target.value
    const newGenData = [...generationData]
    if (newValue === '') {
      if (!typeIndex) {
        newGenData[topicIndex].types[0].number = 0
      } else {
        newGenData[topicIndex].types[typeIndex].number = 0
      }
    }
    recountGenerationData(newGenData)
    setGenerationData(newGenData)
  }

  const handleInput= (event, topicIndex, numOfTopic, typeIndex, numOfType) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    let newGenData = [...generationData]
    if (newValue === '' || newValue.match(/^\d+$/)) {
      const number = newValue === '' ? '' : parseInt(newValue, 10)
      if (typeIndex === -1) {
        clearTopicTypes(newGenData, topicIndex, true)
        if (number === '' || number <= numOfTopic) {
          newGenData[topicIndex].types[0].number = number
          setGenerationData(newGenData)
        }
      } else {
        if (number === '' || number <= numOfType){
          newGenData[topicIndex].types[typeIndex].number = number
          setGenerationData(newGenData)
        }
      }
    }
  }

  const handlePlusInput = (topicIndex, numOfTopic, typeIndex, numOfType) => {
    let newGenData = [...generationData]
    let number = typeIndex === -1 ?
      generationData[topicIndex].number : generationData[topicIndex].types[typeIndex].number
    if (number === '') number = 0

    if (number+1 <= (typeIndex===-1 ? numOfTopic : numOfType)) {
      if (typeIndex === -1) clearTopicTypes(newGenData, topicIndex, true)
      newGenData[topicIndex].types[typeIndex === -1 ? 0 : typeIndex].number++
      recountGenerationData(newGenData)
      setGenerationData(newGenData)
    }
  }

  const handleMinusInput = (topicIndex, typeIndex) => {
    let newGenData = [...generationData]
    let number = typeIndex === -1 ?
      generationData[topicIndex].number : generationData[topicIndex].types[typeIndex].number
    if (number === '') number = 0

    if (number - 1 >= 0) {
      if (typeIndex === -1) clearTopicTypes(newGenData, topicIndex, true)
      newGenData[topicIndex].types[typeIndex === -1 ? 0 : typeIndex].number--
      recountGenerationData(newGenData)
      setGenerationData(newGenData)
    }
  }

  const numberInput = (topicIndex, topic, numOfTopic, type, numOfType) => {
    const typeIndex = type && generationData[topicIndex].types.map(t => t.id).indexOf(type.id)
    return (
      <Box className={style.centeredSection}>
        <IconButton
          size='medium'
          color='primary'
          style={{padding: 3}}
          disabled={type ? generationData[topicIndex].types[0].all : topic.id !== -1 && generationData[0].all}
          onClick={e => type ? handleMinusInput(topicIndex,typeIndex) : handleMinusInput(topicIndex, -1) }
        >
          <BsDashSquareFill/>
        </IconButton>
        <TextField
          size='small'
          variant='outlined'
          disabled={type ? generationData[topicIndex].types[0].all : topic.id !== -1 && generationData[0].all}
          value={type ? generationData[topicIndex].types[typeIndex].number : generationData[topicIndex].types[0].number}
          className={style.numberTextField}
          onBlur={e => type ? optimizeEmptyNumber(e,topicIndex,typeIndex) : optimizeEmptyNumber(e,topicIndex)}
          onChange={e => type ? handleInput(e, topicIndex, numOfTopic, typeIndex, numOfType) : handleInput(e, topicIndex, numOfTopic, -1)}
          inputProps={{
            min: 0,
            maxLength: 3,
            style: {textAlign: 'center', padding: 8, fontSize: 18}
          }}
        >

        </TextField>
        <IconButton
          size='medium'
          color='primary'
          style={{padding: 3}}
          disabled={type ? generationData[topicIndex].types[0].all : topic.id !== -1 && generationData[0].all}
          onClick={e => type ? handlePlusInput(topicIndex, numOfTopic, typeIndex, numOfType) : handlePlusInput(topicIndex, numOfTopic, -1)}
        >
          <BsPlusSquareFill/>
        </IconButton>
        <Typography component='div'>
          <Box marginLeft={1} color={grey[600]} fontSize={18}>/ {type ? numOfType : numOfTopic}</Box>
        </Typography>
      </Box>
    )
  }

  const optimizeEmptyPoints = (event) => {
    const newValue = event.target.value
    if (newValue === '') setPointsForGenerated(0)
  }
  const handleInputPoints = (event) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    if (newValue === '' || newValue.match(/^\d+$/))
      setPointsForGenerated(newValue === '' ? '' : parseInt(newValue,10))
  }
  const handlePlusPoints = () => setPointsForGenerated(prev => prev === '' ? 1  : prev+1)
  const handleMinusPoints = () => setPointsForGenerated(prev => prev === 0 ? 0 : prev-1)

  const pointsInputGenerated = () => {
    return (
      <Box className={style.centeredSection}>
        <IconButton
          size='medium'
          color='primary'
          style={{padding: 3}}
          onClick={e => handleMinusPoints() }
        >
          <BsDashSquareFill/>
        </IconButton>
        <TextField
          size='small'
          variant='outlined'
          value={pointsForGenerated}
          className={style.numberTextField}
          onBlur={e => optimizeEmptyPoints(e)}
          onChange={e => handleInputPoints(e)}
          inputProps={{
            min: 0,
            maxLength: 3,
            style: {textAlign: 'center', padding: 8, fontSize: 18}
          }}
        >

        </TextField>
        <IconButton
          size='medium'
          color='primary'
          style={{padding: 3}}
          onClick={e => handlePlusPoints()}
        >
          <BsPlusSquareFill/>
        </IconButton>
      </Box>
    )
  }

  const allTopicsItem = () => {
    const countUsedTypes = generationData[0].types.reduce((acc,type) => type.id !== -1 && type.number > 0 ? ++acc : acc, 0)
    const countAll = questions.reduce((acc, q) => ++acc,0)
    return (
      <Box>
        <Box key={allTopicsTopic.id} className={style.GS_topicItem} >

          <ListItem key={allTopicsTopic.id} className={style.GS_topicItemCore}>
            <ListItemText
              primary="Number of questions"
            />
            {generationData[0].all ?
              numberInput(0, allTopicsTopic, countAll ) :
              <Box className={style.centeredSection}>
                <Typography style={{fontSize: 18}}>{generationData[0].number}</Typography>
                <Typography style={{fontSize: 18, color: grey[600], marginRight: 8, marginLeft: 8}}>
                  /
                </Typography>
                <Typography style = {{color: grey[600], fontSize: 18}}>
                  {questions.length} {questions.length === 1 ? "question" : "questions"}
                </Typography>
              </Box>
            }
          </ListItem>

          {generationData[0].all &&
          <Button
            color='primary'
            variant='contained'
            className={style.GS_topicItemButton}
            onClick={e => handleOpenSection(allTopicsTopic)}
          >
            <Box width='100%'>
              <Box display='block' width='100%'>
                Question types
                <FaAngleRight size={25} />
              </Box>
              <Box display='block' width='100%'>
                <Typography variant='caption'>
                  {generationData[0].types[0].all ? "(all types)" :
                    `(${countUsedTypes}${countUsedTypes === 1 ? " type selected" : " types selected"})`}
                </Typography>
              </Box>
            </Box>
          </Button>}
        </Box>
      </Box>
    )
  }
  const topicItem = (topic, topicIndex) => {
    const countUsedTypes = generationData[topicIndex].types.reduce((acc,type) => type.id !== -1 && type.number > 0 ? ++acc : acc, 0)
    const count = questions.reduce((acc,question) => question.question.topic === topic.id ? ++acc : acc, 0)
    return (
      <Box key={topic.id} className={style.GS_topicItem}>
        <ListItem key={topic.id} className={style.GS_topicItemCore} disabled={generationData[0].all}>
          <ListItemText
            primary={topic.name}
          />
          {numberInput(topicIndex, topic, count)}
        </ListItem>
        <Button
          color='primary'
          variant='contained'
          className={style.GS_topicItemButton}
          disabled={generationData[0].all}
          onClick={e => handleOpenSection(topic)}
        >
          <Box width='100%'>
            <Box display='block' width='100%'>
              Question types
              <FaAngleRight size={25} />
            </Box>
            <Box display='block' width='100%' hidden={generationData[0].all}>
              <Typography variant='caption'>
                {generationData[topicIndex].types[0].all ? "(all types)"
                  :
                  `(${countUsedTypes}${countUsedTypes === 1 ? " type selected" : " types selected"})`}
              </Typography>
            </Box>
          </Box>
        </Button>
      </Box>
    )
  }

  const typeItem = (topic) => {
    const count = questions.reduce((acc,question) => question.question.topic === topic.id ? ++acc : acc, 0)
    const countOfTopic = generationData[generationData.map(t => t.id).indexOf(topic.id)].number
    const topicIndex = generationData.map(t => t.id).indexOf(topic.id)
    return (
      <Box>
        <Box key={anyType.id} className={style.GS_topicItem}>
          <Button
            color='primary'
            variant='contained'
            className={style.GS_topicItemButton}
            onClick={e => handleOpenSection(null)}
          >
            <FaAngleLeft size={25}/>
            Topics
          </Button>
          <ListItem key={anyType.id} className={style.GS_topicItemCore}>
            <Box display='flex' flexGrow={1}>
              <Typography component='div'><Box fontSize={18}  marginLeft={2} color={grey[700]}>{topic.name}</Box></Typography>
            </Box>
            <Box className={style.centeredSection}>
              {generationData[topicIndex].types[0].all ?
                numberInput(topicIndex, topic, count ) :
                <Box className={style.centeredSection}>
                  <Typography style = {{color: grey[600], fontSize: 18}}>
                    {generationData[topicIndex].number} {generationData[topicIndex].number === 1 ? "question" : "questions"}
                  </Typography>
                </Box>
              }
            </Box>
          </ListItem>
        </Box>
        <Box className={style.centeredSection} flexGrow={1}>
          <Typography component='div'><Box fontSize={18}>Select per type</Box></Typography>
          <Switch
            checked={!generationData[topicIndex].types[0].all}
            color='primary'
            onChange={e => handleAnyType(topic, topicIndex)}/>
        </Box>
        <Box overflow='hidden'>
          <div>
            {Object.values(QuestionTypesEnums).map(type => {
              const countOfType = topic.id === -1 ?
                questions.reduce((acc, question) =>
                  question.question.questionType === type.id ? ++acc : acc, 0) :
                questions.reduce((acc, question) =>
                  question.question.topic === topic.id &&
                  question.question.questionType === type.id ? ++acc : acc, 0)
              if (!excludeEssay || type.id !== QuestionTypesEnums.essay.id) return (
                <Box key={type.id} className={style.GS_topicItem}>
                  <ListItem key={type.id} className={style.GS_topicItemCore} disabled={generationData[topicIndex].types[0].all}>
                    <ListItemText
                      primary={type.name}
                    />
                    { numberInput(topicIndex, topic, countOfTopic , type, countOfType)}
                  </ListItem>
                </Box>
              )
            })}
          </div>
        </Box>
        <Box display='flex' width='100%'>
          <Box minWidth='50%' display='flex' justifyContent='flex-start'>
            {topicIndex > 1 &&
            <Button
              color='primary'
              variant='text'
              fullWidth
              className={style.GS_changeTopicButton}
              onClick={e => handleOpenSection(generationData[topicIndex-1])}
            >
              <FaAngleLeft size={25} />
              {generationData[topicIndex-1].name}
            </Button>}
          </Box>
          <Box minWidth='50%' display='flex' justifyContent='flex-end'>
            {topicIndex+1 < generationData.length &&
            <Button
              color='primary'
              variant='text'
              fullWidth
              className={style.GS_changeTopicButton}
              onClick={e => handleOpenSection(generationData[topicIndex+1])}
            >
              {generationData[topicIndex+1].name}
              <FaAngleRight size={25} />
            </Button>}
          </Box>
        </Box>
      </Box>
    )}

  function tabManager() {
    if (!openedSection) {
      return (
        <Box className={style.sectionRoot}>
          {allTopicsItem()}
          <Box className={style.centeredSection} marginBottom={2}>
            <Checkbox
              checked={excludeEssay}
              onChange={e => {
                setWarningGeneration('')
                setExcludeEssay(prevState => !prevState)
              }}
            />
            <Typography>Exclude questions that require grading</Typography>
          </Box>
          <Box className={style.centeredSection}>
            <Typography component='div'><Box fontSize={19}>Select per topic</Box></Typography>
            <Switch
              checked={!generationData[0].all}
              color='primary'
              disabled={topicsSelected.length === 0}
              onChange={e => handleAllTopics()}/>
          </Box>
          {generationData.length > 1 ?
            <Box overflow='hidden'>
              {generationData.slice(1).map((topic, index) =>
                topicItem(topic, index+1),
              )}
            </Box> :
            <ListItem className = {style.centeredSection} style={{width: '100%', textAlign: 'center'}}>
              <ListItemText
                secondary={`No topics available`}
              />
            </ListItem>
          }
        </Box>
      )
    } else {
      return typeItem(openedSection)
    }
  }


  return quizMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
    <Box overflow='auto' maxHeight={600}>
      {tabManager()}
    </Box> :
    <Box marginBottom={2}>
      {tabManager()}
      <ListItem className={`${style.centeredSection} ${style.GS_topicItemCore} ${style.GS_topicItem}`}>
        <Typography component='div'><Box fontSize={18} padding={1}>Points per question: </Box></Typography>
        {pointsInputGenerated()}
      </ListItem>
    </Box>


}

export default GenerateQuestionsSection
