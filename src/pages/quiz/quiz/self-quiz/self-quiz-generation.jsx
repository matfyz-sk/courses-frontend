import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { customTheme, useStyles } from '../../common/style/styles'
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { BsDashSquareFill, BsPlusSquareFill } from 'react-icons/all'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

function SelfQuizGeneration({
                              topics,
                              publicQuestions,
                              availableQuestions,
                              setAvailableQuestions,
                              generationData,
                              setGenerationData,
                            }){

  const style = useStyles()

  const [openCategory, setOpenCategory] = useState([])
  const [includedCategories, setIncludedCategories] = useState(["Covered topics"])

  useEffect(() => {
    let newQuestions = []
    if (includedCategories.indexOf("Covered topics") !== -1)
      newQuestions = newQuestions.concat(publicQuestions.filter(question => topics.covers.some(topic => topic['@id'] === question.ofTopic[0]['@id'])))
    if (includedCategories.indexOf("Mentioned topics") !== -1)
      newQuestions = newQuestions.concat(publicQuestions.filter(question => topics.mentions.some(topic => topic['@id'] === question.ofTopic[0]['@id'])))
    if (includedCategories.indexOf("Required topics") !== -1)
      newQuestions = newQuestions.concat(publicQuestions.filter(question => topics.requires.some(topic => topic['@id'] === question.ofTopic[0]['@id'])))
    setAvailableQuestions(newQuestions)
  },[includedCategories])

  const allTopicsTopic = {name: 'All topics', id: -1}

  const handleAllTopics = () => {
    let newState = [...generationData]
    if (!generationData[0].all){
      newState[0].number = 0
      newState[0].types.map(t => t.number = 0)
      newState[0].types[0].all = true
      if (openCategory.indexOf("Covered topics") !== -1) handleCategoryCollapse("Covered topics")
    } else {
      newState[0].number = generationData.reduce((acc, topic) => topic.id !== -1 ? acc+topic.number : acc, 0)
      if (openCategory.indexOf("Covered topics") === -1) handleCategoryCollapse('Covered topics')
    }
    newState[0].all = !newState[0].all
    setGenerationData(newState)
  }

  const optimizeEmptyNumber = (event, topic, topicToEdit) => {
    const newValue = event.target.value
    if (newValue === '') {
      const newState = [...generationData]
      newState[topicToEdit].number = 0
      setGenerationData(newState)
    }
  }

  const handleInput= (event, topic, numOfTopic, topicToEdit) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    let newState = [...generationData]
    if (newValue === '' || newValue.match(/^\d+$/)) {
      const number = newValue === '' ? '' : parseInt(newValue, 10)
      if (number === '' || number <= numOfTopic) {
        if (topic.id !== -1) newState[0].number = newState[0].number - newState[topicToEdit].number + number
        newState[topicToEdit].number = number
        setGenerationData(newState)
      }
    }
  }

  const handlePlusInput = (topic, numOfTopic, topicToEdit) => {
    let number
    let newState = [...generationData]
    number = generationData[topicToEdit].number
    if (number === '') number = 0
    if (number+1 <= numOfTopic) {
      newState[topicToEdit].number = number+1
      if (topic.id !== -1) newState[0].number++
      setGenerationData(newState)
    }
  }

  const handleMinusInput = (topic, topicToEdit) => {
    let number
    let newState = [...generationData]
    number = generationData[topicToEdit].number
    if (number !== '' && number-1 >= 0) {
      newState[topicToEdit].number = number-1
      if (topic.id !== -1) newState[0].number--
      setGenerationData(newState)
    }
  }

  const numberInput = (topic, numOfTopic) => {
    const topicIndex = generationData.map(t => t.id).indexOf(topic.id)
    return (
      <Box className={style.centeredSection}>
        <IconButton
          size='medium'
          color='primary'
          style={{padding: 3}}
          disabled={topicIndex !== 0 && generationData[0].all}
          onClick={e => handleMinusInput(topic,topicIndex) }
        >
          <BsDashSquareFill/>
        </IconButton>
        <TextField
          size='small'
          variant='outlined'
          disabled={topicIndex !== 0 && generationData[0].all}
          value={generationData[topicIndex].number}
          className={style.numberTextField}
          onBlur={e => optimizeEmptyNumber(e,topic, topicIndex)}
          onChange={e => handleInput(e, topic, numOfTopic, topicIndex)}
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
          disabled={topicIndex !== 0 && generationData[0].all}
          onClick={e => handlePlusInput(topic, numOfTopic, topicIndex)}
        >
          <BsPlusSquareFill/>
        </IconButton>
        <Typography component='div'>
          <Box marginLeft={1} fontSize={18}>/ {numOfTopic}</Box>
        </Typography>
      </Box>
    )
  }

  const allTopicsItem = () => {
    return (
      <Box>
        <Box key={allTopicsTopic.id} className={style.GS_topicItem} >

          <ListItem key={allTopicsTopic.id} className={style.GS_topicItemCore}>
            <ListItemText
              primary={<Typography style={{fontSize: 18}}>Number of questions</Typography>}
            />
            {generationData[0].all ?
              numberInput(allTopicsTopic, availableQuestions.length) :
              <Box className={style.centeredSection}>
                <Typography component='div'>
                  <Box fontSize={18}>
                    {generationData[0].number} {generationData[0].number === 1 ? "question" : "questions"}
                  </Box>
                </Typography>
              </Box>
            }
          </ListItem>
        </Box>
      </Box>
    )
  }

  const handleCheckTopicCategory = (name) => {
    const index = includedCategories.indexOf(name)
    let newIncluded = [...includedCategories]
    if (index === -1) newIncluded.push(name)
    else newIncluded.splice(index,1)
    if (newIncluded.length > 0) setIncludedCategories(newIncluded)
  }

  const topicCategoryCheckBox = (genData, topics, name) => {
    const filteredGenData = genData.filter(gTopic => topics.some(topic => topic['@id'] === gTopic.id))

    return (
      <Box className={style.centeredSection} marginRight={3}>
        <Checkbox
          checked={includedCategories.indexOf(name) !== -1}
          disabled={filteredGenData.length === 0}
          onChange={e => handleCheckTopicCategory(name)}
        />
        <Typography
          color={filteredGenData.length === 0 ? "textSecondary" : "textPrimary"}
        >{name}</Typography>
      </Box>
    )
  }

  const getChooseCategoryPanel = (genData) => {
    return (
      <Collapse in={generationData[0].all}>
        <Box className={style.centeredSection}>
          <Box className={style.centeredSection} marginRight={5}>
            <Typography>Include: </Typography>
          </Box>
          {topicCategoryCheckBox(genData, topics.covers, "Covered topics")}
          {topicCategoryCheckBox(genData, topics.mentions, "Mentioned topics")}
          {topicCategoryCheckBox(genData, topics.requires, "Required topics")}
        </Box>
      </Collapse>
    )
  }

  const topicItem = (topic) => {
    const count = publicQuestions.reduce((acc,question) => question.ofTopic[0]['@id'] === topic.id ? ++acc : acc, 0)
    return (
      <Box key={topic.id} className={style.GS_topicItem}>
        <ListItem key={topic.id} className={style.GS_topicItemCore} disabled={generationData[0].all}>
          <ListItemText
            primary={topic.name}
          />
          {numberInput(topic, count)}
        </ListItem>
      </Box>
    )
  }

  const handleCategoryCollapse = (index) => {
    const currentIndex = openCategory.indexOf(index);
    const newOpen = [...openCategory];
    if (currentIndex === -1) {
      newOpen.push(index);
    } else {
      newOpen.splice(currentIndex, 1);
    }
    setOpenCategory(newOpen);
  }

  const getTopicCat = (genData, topics, name) => {
    const filteredGenData = genData.filter(gTopic => topics.some(topic => topic['@id'] === gTopic.id))
    return (
      <Box marginTop={1}>
        <ListItem
          button
          className={`${style.sectionHeader} ${style.startSection}`}
          disabled={generationData[0].all || filteredGenData.length === 0}
          onClick={e => handleCategoryCollapse(name)}
        >
          <Box marginRight={1}>
            {openCategory.indexOf(name) !== -1 ? <FaAngleUp /> : <FaAngleDown />}
          </Box>
          <ListItemText
            primary={<Typography style={{fontSize: 18}}>{name}</Typography>}
          />
        </ListItem>
        <Collapse in={openCategory.indexOf(name) !== -1}>
          {filteredGenData.map((topic) =>
            topicItem(topic),
          )}
        </Collapse>
      </Box>)
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box className={style.sectionRoot}>
        <Box className={style.centeredSection} marginBottom={1}>
          <h3>New self quiz</h3>
        </Box>
        {allTopicsItem()}
        {getChooseCategoryPanel(generationData.slice(1))}
        <Box className={style.centeredSection} marginTop={3}>
          <Typography component='div'><Box fontSize={19}>Select per topic</Box></Typography>
          <Switch
            checked={!generationData[0].all}
            color='primary'
            disabled={topics.length === 0}
            onChange={e => handleAllTopics()}/>
        </Box>
        {getTopicCat(generationData.slice(1), topics.covers, "Covered topics")}
        {getTopicCat(generationData.slice(1), topics.mentions, "Mentioned topics")}
        {getTopicCat(generationData.slice(1), topics.requires, "Required topics")}
      </Box>
    </ThemeProvider>
  )
}

export default SelfQuizGeneration
