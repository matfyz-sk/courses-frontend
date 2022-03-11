import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  Checkbox,
  Chip,
  ClickAwayListener,
  Collapse,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import QuizQuestion from '../../common/quiz-question'
import { QuestionTypesEnums, QuizAssignmentTypesEnums } from '../../common/functions/type-enums'
import { customTheme, useStyles } from '../../common/style/styles'
import { FaAngleDoubleDown, FaAngleDoubleUp, FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { HiSortAscending, HiSortDescending } from 'react-icons/hi'
import GenerateQuestionsSection from './generate-questions-section'
import { MdFilterList } from 'react-icons/all'
import WarningMessage from '../../common/warning-message'
import {
  createGenerationData,
  generateQuestions,
  validateGenerationData,
} from '../../common/functions/generation_functions'
import { grey } from '@material-ui/core/colors'


function not(a, b) {
  return a.filter((value) => b.map(v => v.question).indexOf(value.question) === -1);
}

function ManualQuizAssignment({
                                topicsSelected,
                                availableQuestions,
                                selectedQuestions,
                                setSelectedQuestions,
                                pointsForAll,
                                maxPositionSelected,
                                setMaxPositionSelected,
                                isEdit,
                                generationData,
                                setGenerationData,
                                warningGeneration,
                                setWarningGeneration,
                                excludeEssay,
                                setExcludeEssay
                              }) {

  const style = useStyles()

  const [ questions, setQuestions ] = useState(availableQuestions)

  const [ openQuestions, setOpenQuestions ] = useState([])
  const [ filteredTypes, setFilteredTypes ] = useState([])
  const [ filteredTopics, setFilteredTopics ] = useState([])
  const [ filteredVisibility, setFilteredVisibility ] = useState([ 'private', 'public' ])

  //TODO temp
  const [ openGenerateQuestions, setOpenGenerateQuestions ] = useState(false);

  const [ sortingMode, setSortingMode ] = useState(0)

  const [ anchorElType, setAnchorElType ] = useState(null);
  const [ anchorElTopic, setAnchorElTopic ] = useState(null);
  const [ anchorElVisibility, setAnchorElVisibility ] = useState(null);

  useEffect(() => {
    setQuestions(filterQuestions(not(availableQuestions, selectedQuestions)))
  }, [ filteredTypes, filteredVisibility, filteredTopics, selectedQuestions ])

  const handleOpenTypes = (event) => {
    setAnchorElType(event.currentTarget);
  };
  const handleOpenTopics = (event) => {
    setAnchorElTopic(event.currentTarget);
  };
  const handleOpenVisibility = (event) => {
    setAnchorElVisibility(event.currentTarget);
  };

  const filterQuestions = (questions) => {
    let questionsFiltered = [ ...questions ]

    if(filteredTypes.length > 0) {
      questionsFiltered = questionsFiltered.filter(question => filteredTypes
        .map(type => type.id).indexOf(question.question.questionType) !== -1)
    }
    if(filteredTopics.length > 0) {
      questionsFiltered = questionsFiltered.filter(question =>
        filteredTopics.map(topic => {
          return topic.id
        }).indexOf(question.question.topic) !== -1
      )
    }
    if(filteredVisibility.length === 1 && filteredVisibility[0] === 'private')
      questionsFiltered = questionsFiltered.filter(question => question.question.visibilityIsRestricted)
    else if(filteredVisibility.length === 1 && filteredVisibility[0] === 'public')
      questionsFiltered = questionsFiltered.filter(question => !question.question.visibilityIsRestricted)

    if(sortingMode === 1)
      return (questionsFiltered.sort(
        (a, b) => {
          return a.question.createdAt - b.question.createdAt
        }
      ))
    if(sortingMode === 2)
      return (questionsFiltered.sort(
        (a, b) => {
          return b.question.createdAt - a.question.createdAt
        }
      ))
    else return questionsFiltered
  }

  const selectType = (type) => {
    const currentIndex = filteredTypes.map(typeS => typeS.id).indexOf(type.id)

    const newState = [ ...filteredTypes ]
    if(currentIndex === -1) {
      newState.push(type)
    } else {
      newState.splice(currentIndex, 1)
    }
    setFilteredTypes(newState)
  }

  const selectTopic = (topic) => {
    const currentIndex = filteredTopics.map(topicS => topicS.id).indexOf(topic.id)
    const newState = [ ...filteredTopics ]
    if(currentIndex === -1) {
      newState.push(topic)
    } else {
      newState.splice(currentIndex, 1)
    }
    setFilteredTopics(newState)
  }

  const selectVisibility = (visibility) => {
    const currentIndex = filteredVisibility.indexOf(visibility)
    const newState = [ ...filteredVisibility ]
    if(currentIndex === -1) newState.push(visibility)
    else newState.splice(currentIndex, 1)
    setFilteredVisibility(newState.length === 0 ? [ 'private', 'public' ] : newState)
  }

  const addToSelectedQuestions = (question) => {
    setSelectedQuestions(prevState => prevState.concat(
      {...question, points: pointsForAll, position: ++maxPositionSelected}))
    setMaxPositionSelected(prevState => prevState + 1)
  }

  const handleOpenQuestion = (question) => {
    const currentIndex = openQuestions.indexOf(question)
    const newState = [ ...openQuestions ]
    if(currentIndex === -1) {
      newState.push(question)
    } else {
      newState.splice(currentIndex, 1)
    }
    setOpenQuestions(newState)
  }

  const handleOpenGenerateQuestions = () => {
    setOpenGenerateQuestions(prevState => !prevState)
  }

  const handleGenerate = () => {
    if(validateGenerationData(generationData, setWarningGeneration)) {
      let questionOptions = [ ...questions ]
      if(excludeEssay)
        questionOptions = questions.filter(question => question.question.questionType !== QuestionTypesEnums.essay.id)
      const generatedQuestions = generateQuestions(generationData, not(questionOptions, selectedQuestions))
      generatedQuestions.map(question => addToSelectedQuestions(question))
      setQuestions(prevState => not(prevState, generatedQuestions))
      setOpenGenerateQuestions(false)
      setGenerationData(createGenerationData(topicsSelected, not(questions, generatedQuestions)))
    }
  }
  return (
    <div>
      { !isEdit &&
        <div className={ style.sectionRoot }>
          <Card variant='outlined' style={ {border: 0, borderRadius: 0} }>
            <CardActionArea onClick={ handleOpenGenerateQuestions }
                            className={ `${ style.startSection } ${ style.sectionHeader }` }>
              <Typography variant='h6'>Generate questions</Typography>
              { openGenerateQuestions ?
                <FaAngleUp size={ 25 } style={ {marginLeft: 10} }/> :
                <FaAngleDown size={ 25 } style={ {marginLeft: 10} }/> }
            </CardActionArea>
          </Card>
          <Collapse in={ openGenerateQuestions }>
            <GenerateQuestionsSection
              topicsSelected={ topicsSelected }
              availableQuestions={ questions }
              generationData={ generationData }
              setGenerationData={ setGenerationData }
              setWarningGeneration={ setWarningGeneration }
              quizMode={ QuizAssignmentTypesEnums.manualQuizAssignment }
              excludeEssay={ excludeEssay }
              setExcludeEssay={ setExcludeEssay }
            />
            <Box display='flex' marginBottom={ 2 } justifyContent='center'>
              <WarningMessage
                text={ warningGeneration }
              />
            </Box>
            <Box display='flex' width='100%' flexGrow={ 1 } justifyContent='center'>
              <Button
                variant='contained'
                color='primary'
                size='large'
                style={ {fontSize: 17} }
                onClick={ e => handleGenerate() }
              >
                Generate
              </Button>
            </Box>
          </Collapse>
        </div> }
      <div className={ style.sectionRoot }>
        <Typography variant='h6' className={ `${ style.sectionHeader } ${ style.startSection }` }>All
          available questions</Typography>
        <div style={ {width: '100%'} }>
          <AppBar
            className={ style.sectionAppbar }
            position='static'
            variant='outlined'
          >
            <Toolbar style={ {padding: 10} }>
              <Box
                flexGrow={ 1 }
                justifyContent='flex-start'
              >
                <Button
                  onClick={ e => handleOpenTypes(e) }
                  color={ 'secondary' }
                  variant={ Boolean(anchorElType) || filteredTypes.length > 0 ? 'contained' : 'outlined' }
                  className={ style.MQA_optionButton }
                >
                  <MdFilterList className={ style.MQA_buttonIcon }
                                color={ Boolean(anchorElTopic) || filteredTypes.length > 0 ? grey[50] : customTheme.palette.secondary.main }/>
                  <span className={ style.smDownDisplayNone }>Filter </span> type
                </Button>
                <Popper
                  anchorEl={ anchorElType }
                  placement='bottom-start'
                  open={ Boolean(anchorElType) }
                  style={ {position: 'fixed'} }

                >
                  <Paper>
                    <ClickAwayListener onClickAway={ e => setAnchorElType(null) }>
                      <MenuList>
                        <MenuItem
                          key={ 'all' }
                          value="All types"
                          onClick={ e => {
                            setFilteredTypes([]);
                            setAnchorElType(null)
                          } }
                        >
                          <Checkbox color='primary' checked={ filteredTypes.length === 0 }/>
                          <ListItemText primary={ <i>All question types</i> }/>
                        </MenuItem>
                        { Object.values(QuestionTypesEnums).map((type) => {
                          return (
                            <MenuItem
                              key={ type.id }
                              value={ type.name }
                              onClick={ e => selectType(type) }
                            >
                              <Checkbox color='primary'
                                        checked={ filteredTypes.map(t => t.id).indexOf(type.id) !== -1 }/>
                              <ListItemText primary={ type.name }/>
                            </MenuItem>
                          )
                        }) }
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>

                <Button
                  onClick={ e => handleOpenTopics(e) }
                  color={ 'secondary' }
                  variant={ Boolean(anchorElTopic) || filteredTopics.length > 0 ? 'contained' : 'outlined' }
                  className={ style.MQA_optionButton }
                >
                  <MdFilterList className={ style.MQA_buttonIcon }
                                color={ Boolean(anchorElTopic) || filteredTopics.length > 0 ? grey[50] : customTheme.palette.secondary.main }/>
                  <span className={ style.smDownDisplayNone }>Filter </span> topic
                </Button>
                <Popper
                  anchorEl={ anchorElTopic }
                  placement='bottom-start'
                  open={ Boolean(anchorElTopic) }
                  style={ {position: 'fixed'} }
                >
                  <Paper>
                    <ClickAwayListener onClickAway={ e => setAnchorElTopic(null) }>
                      <MenuList>
                        <MenuItem
                          key={ 'all' }
                          value="All types"
                          onClick={ e => {
                            setAnchorElTopic(null);
                            setFilteredTopics([])
                          } }
                        >
                          <Checkbox color='primary' checked={ filteredTopics.length === 0 }/>
                          <ListItemText primary={ <i>All topics</i> }/>
                        </MenuItem>
                        { topicsSelected.map((topic) => {
                          return (
                            <MenuItem
                              key={ topic.id }
                              value={ topic.name }
                              onClick={ e => selectTopic(topic) }
                            >
                              <Checkbox color='primary'
                                        checked={ filteredTopics.map(t => t.id).indexOf(topic.id) !== -1 }/>
                              <ListItemText primary={ topic.name }/>
                            </MenuItem>
                          )
                        }) }
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>

                <Button
                  onClick={ e => handleOpenVisibility(e) }
                  color={ 'secondary' }
                  variant={ Boolean(anchorElVisibility) || filteredVisibility.length === 1 ? 'contained' : 'outlined' }
                  className={ style.MQA_optionButton }
                >
                  <MdFilterList className={ style.MQA_buttonIcon }
                                color={ Boolean(anchorElVisibility) || filteredVisibility.length === 1 ? grey[50] : customTheme.palette.secondary.main }/>
                  <span className={ style.smDownDisplayNone }>Filter </span> visibility
                </Button>
                <Popper
                  anchorEl={ anchorElVisibility }
                  placement='bottom-start'
                  open={ Boolean(anchorElVisibility) }
                  style={ {position: 'fixed'} }
                >
                  <Paper>
                    <ClickAwayListener onClickAway={ e => setAnchorElVisibility(null) }>
                      <MenuList>
                        <MenuItem
                          key={ 'private' }
                          onClick={ e => selectVisibility('private') }
                        >
                          <Checkbox color='primary' checked={ filteredVisibility.indexOf('private') !== -1 }/>
                          <ListItemText primary="Approved as private"/>
                        </MenuItem>
                        <MenuItem
                          key={ 'public' }
                          onClick={ e => selectVisibility('public') }
                        >
                          <Checkbox color='primary' checked={ filteredVisibility.indexOf('public') !== -1 }/>
                          <ListItemText primary="Approved as public"/>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>

                <Button
                  onClick={ e => setSortingMode(prevState => (prevState + 1) % 3) }
                  color={ 'secondary' }
                  variant={ sortingMode === 0 ? 'outlined' : 'contained' }
                  className={ style.MQA_optionButton }
                >
                  { sortingMode === 2 ?
                    <HiSortAscending
                      className={ style.MQA_buttonIcon }
                      color={ sortingMode === 0 ? customTheme.palette.secondary.main : grey[50] }/>
                    :
                    <HiSortDescending
                      className={ style.MQA_buttonIcon }
                      color={ sortingMode === 0 ? customTheme.palette.secondary.main : grey[50] }/> }
                  <span className={ style.smDownDisplayNone }>Sort by </span> date
                </Button>
              </Box>
              <Box justifyContent='flex-end'>
                <IconButton className={ style.iconButton } onClick={ e => setOpenQuestions(questions) }>
                  <FaAngleDoubleDown color={ customTheme.palette.primary.main }/>
                </IconButton>
                <IconButton className={ style.iconButton } onClick={ e => setOpenQuestions([]) }>
                  <FaAngleDoubleUp color={ customTheme.palette.primary.main }/>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Box>
            <List className={ style.MQA_questionList }>
              { questions.length === 0 ?
                <ListItem>
                  <ListItemText
                    secondary={ `No available questions` }
                  />
                </ListItem>
                :
                questions.map(question => {
                  return (
                    <div key={ question.question.id } className={ style.MQA_questionItem } style={ {borderRight: 0} }>
                      <Fade in>
                        <Box
                          display='flex'
                          borderBottom={ openQuestions.indexOf(question) !== -1 ? `1px solid ${ grey[300] }` : 0 }
                        >
                          <Box width='94%'>
                            <ListItem
                              button
                              onClick={ e => handleOpenQuestion(question) }
                            >
                              <ListItemIcon>
                                { openQuestions.indexOf(question) !== -1 ?
                                  <FaAngleUp size={ 25 }/> : <FaAngleDown size={ 25 }/> }
                              </ListItemIcon>
                              <ListItemText
                                primary={ question.question.title }
                              />
                              { question.question.visibilityIsRestricted &&
                                <Chip label="Private"/> }
                            </ListItem>
                          </Box>
                          <Box width='6%' padding={ 0 } display='flex'>
                            <Button
                              color='primary'
                              variant='contained'
                              fullWidth
                              style={ {margin: 0, borderRadius: 0, boxShadow: 0, height: '100%'} }
                              onClick={ e => {
                                e.stopPropagation();
                                addToSelectedQuestions(question)
                              } }
                            >
                              Add
                            </Button>
                          </Box>
                        </Box>
                      </Fade>
                      <Collapse
                        in={ openQuestions.indexOf(question) !== -1 }
                      >
                        <ListItem component={ "div" } style={ {display: 'flex'} }>
                          <QuizQuestion
                            question={ question }
                            variant='questionPreview'
                          />
                        </ListItem>
                      </Collapse>
                    </div>
                  )
                }) }
            </List>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default ManualQuizAssignment
