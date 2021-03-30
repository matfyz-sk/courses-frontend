import React, {useState} from 'react'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  Checkbox,
  ClickAwayListener,
  Collapse,
  Fade,
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
import QuizQuestion from "../../common/quiz-question";
import {QuestionTypesEnums} from "../../question/question/question-new-data";
import {useStyles} from '../../common/styles'
import {FaAngleDoubleDown, FaAngleDoubleUp, FaAngleDown, FaAngleUp} from 'react-icons/fa'
import {HiSortAscending, HiSortDescending} from 'react-icons/hi'
import GenerateQuestionsSection from "./generate-questions-section";
import {MdFilterList} from "react-icons/all";


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
                              }) {

  const style = useStyles()

  const [openQuestions, setOpenQuestions] = useState([])
  const [filteredTypes, setFilteredTypes] = useState([])
  const [filteredTopics, setFilteredTopics] = useState([])
  const [openGenerateQuestions, setOpenGenerateQuestions] = useState(false);

  const [sortingMode, setSortingMode] = useState(0)

  const [anchorElType, setAnchorElType] = React.useState(null);
  const [anchorElTopic, setAnchorElTopic] = React.useState(null);

  const handleOpenTypes= (event) => {
    setAnchorElType(event.currentTarget);
  };
  const handleOpenTopics= (event) => {
    setAnchorElTopic(event.currentTarget);
  };

  function filteredQuestions()  {
    let questionsFiltered = not(availableQuestions, selectedQuestions)

    if (filteredTypes.length > 0) {
      questionsFiltered = questionsFiltered.filter(question => filteredTypes
        .map(type => type.id).indexOf(question.question.questionType) !== -1)
    }
    if (filteredTopics.length > 0) {
      questionsFiltered = questionsFiltered.filter(question =>
        filteredTopics.map(topic => {return topic.id}).indexOf(question.question.topic) !== -1
      )
    }
    if (sortingMode === 1)
      return (questionsFiltered.sort(
        (a, b) => {return a.question.createdAt - b.question.createdAt}
      ))
    if (sortingMode === 2)
      return (questionsFiltered.sort(
        (a, b) => {return b.question.createdAt - a.question.createdAt}
      ))
    else return questionsFiltered
  }

  const selectType = (type) => {
    const currentIndex = filteredTypes.map(typeS => typeS.id).indexOf(type.id)

    const newState = [...filteredTypes]
    if (currentIndex === -1) {
      newState.push(type)
    } else {
      newState.splice(currentIndex, 1)
    }
    setFilteredTypes(newState)
  }

  const selectTopic = (topic) => {
    const currentIndex = filteredTopics.map(topicS => topicS.id).indexOf(topic.id)
    const newState = [...filteredTopics]
    if (currentIndex === -1) {
      newState.push(topic)
    } else {
      newState.splice(currentIndex, 1)
    }
    setFilteredTopics(newState)
  }

  const addToSelectedQuestions = (question) => {
    setSelectedQuestions(prevState => prevState.concat(
      {...question, points: pointsForAll, position: maxPositionSelected}))
    setMaxPositionSelected(prevState => prevState+1)
  }

  const handleOpenQuestion = (question) => {
    const currentIndex = openQuestions.indexOf(question)
    const newState = [...openQuestions]
    if (currentIndex === -1) {
      newState.push(question)
    } else {
      newState.splice(currentIndex, 1)
    }
    setOpenQuestions(newState)
  }

  const handleOpenGenerateQuestions = () => {
    setOpenGenerateQuestions(prevState => !prevState)
  }

  return (
    <div>
      {!isEdit &&
        <div className={style.sectionRoot}>
        <Card variant='outlined' style={{border: 0, borderRadius: 0}}>
          <CardActionArea onClick={e => handleOpenGenerateQuestions()}
                          className={style.sectionHeader}>
            <Typography variant='h6'>Generate questions</Typography>
            {openGenerateQuestions ?
              <FaAngleUp size={25} style={{marginLeft: 10}}/> :
              <FaAngleDown size={25} style={{marginLeft: 10}}/>}
          </CardActionArea>
        </Card>
        <Collapse in={openGenerateQuestions}>
          {/*<GenerateQuestionsSection*/}
          {/*  topicsSelected={topicsSelected}*/}
          {/*  availableQuestions={availableQuestions}*/}
          {/*/>*/}
          <div
            style={{width: '100%', display: 'flex', flexGrow: 1, justifyContent: 'center'}}
          >
            <Button
              variant='contained'
              color='primary'
            >
              Generate
            </Button>
          </div>
        </Collapse>
      </div>}
      <div className={style.sectionRoot}>
        <Typography variant='h6' className={style.sectionHeader}>All available questions</Typography>
        <div style={{width: '100%'}}>
          <AppBar
            className={style.sectionAppbar}
            position='static'
            variant = 'outlined'
          >
            <Toolbar style={{padding: 10}}>
              <Box
                flexGrow={1}
                justifyContent='flex-start'
              >
                <Button
                  onClick={e => handleOpenTypes(e)}
                  color = {Boolean(anchorElType) || filteredTypes.length > 0 ? 'primary' : 'secondary'}
                  variant = {Boolean(anchorElType) || filteredTypes.length > 0 ? 'contained' : 'outlined'}
                  className={style.MQA_optionButton}
                >
                  <MdFilterList className={style.MQA_buttonIcon}/>
                  <span className={style.smDownDisplayNone}>Filter </span> type
                </Button>
                <Popper
                  anchorEl={anchorElType}
                  placement = 'bottom-start'
                  open={Boolean(anchorElType)}
                  style={{position: 'fixed'}}

                >
                  <Paper>
                    <ClickAwayListener onClickAway={e => setAnchorElType(null)}>
                      <MenuList>
                        <MenuItem
                          key={'all'}
                          value = "All types"
                          onClick={e => {setFilteredTypes([]);setAnchorElType(null)}}
                        >
                          <Checkbox color='primary' checked = {filteredTypes.length === 0}/>
                          <ListItemText primary={<i>All question types</i>} />
                        </MenuItem>
                        {Object.values(QuestionTypesEnums).map((type) => {
                          return (
                            <MenuItem
                              key={type.id}
                              value={type.name}
                              onClick={e => selectType(type)}
                            >
                              <Checkbox color='primary' checked = {filteredTypes.map( t => t.id).indexOf(type.id) !== -1}/>
                              <ListItemText primary={type.name} />
                            </MenuItem>
                          )
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>

                <Button
                  onClick={e => handleOpenTopics(e)}
                  color = {Boolean(anchorElType) || filteredTypes.length > 0 ? 'primary' : 'secondary'}
                  variant = {Boolean(anchorElTopic) || filteredTopics.length > 0  ? 'contained' : 'outlined'}
                  className={style.MQA_optionButton}
                >
                  <MdFilterList className={style.MQA_buttonIcon}/>
                  <span className={style.smDownDisplayNone}>Filter </span> topic
                </Button>
                <Popper
                  anchorEl={anchorElTopic}
                  placement = 'bottom-start'
                  open={Boolean(anchorElTopic)}
                  style={{position: 'fixed'}}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={e => setAnchorElTopic(null)}>
                      <MenuList>
                        <MenuItem
                          key={'all'}
                          value = "All types"
                          onClick={e => {setAnchorElTopic(null) ;setFilteredTopics([])}}
                        >
                          <Checkbox color='primary' checked = {filteredTopics.length === 0}/>
                          <ListItemText primary={<i>All topics</i>} />
                        </MenuItem>
                        {topicsSelected.map((topic) => {
                          return (
                            <MenuItem
                              key={topic.id}
                              value={topic.name}
                              onClick={e => selectTopic(topic)}
                            >
                              <Checkbox color='primary' checked = {filteredTopics.map( t => t.id).indexOf(topic.id) !== -1}/>
                              <ListItemText primary={topic.name} />
                            </MenuItem>
                          )
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>
                <Button
                  onClick={e => setSortingMode(prevState => (prevState+1)%3)}
                  color = {sortingMode === 0 ? 'secondary' : 'primary'}
                  variant = {sortingMode === 0 ? 'outlined' : 'contained'}
                  className={style.MQA_optionButton}
                >
                  {sortingMode === 2 ?
                    <HiSortAscending className={style.MQA_buttonIcon}/>
                    :
                    <HiSortDescending className={style.MQA_buttonIcon}/>}
                  <span className={style.smDownDisplayNone}>Sort by </span> date
                </Button>
              </Box>
              <Box justifyContent='flex-end'>
                <ButtonGroup color = 'secondary'>
                  <Button
                    onClick = {e => setOpenQuestions(filteredQuestions)}
                  >
                    <FaAngleDoubleDown className={style.MQA_buttonIcon}/>
                    <span className={style.smDownDisplayNone}>Expand </span>
                  </Button>
                  <Button
                    onClick = {e => setOpenQuestions([])}
                  >
                    <FaAngleDoubleUp className={style.MQA_buttonIcon}/>
                    <span className={style.smDownDisplayNone}>Collapse </span>
                  </Button>
                </ButtonGroup>
              </Box>
            </Toolbar>
          </AppBar>

          <Card variant='outlined' className = { style.MQA_questionList}>
            <List>
              {filteredQuestions().length === 0 ?
                <ListItem>
                  <ListItemText
                    secondary={`No available questions`}
                  />
                </ListItem>
                :
                filteredQuestions().map(question => {
                  return (
                    <div key={question.question.id} className = {style.MQA_questionItem}>
                      <Fade in>
                        <ListItem
                          button
                          onClick={e => handleOpenQuestion(question)}
                        >
                          <ListItemIcon>
                            {openQuestions.indexOf(question) !== -1 ?
                              <FaAngleUp size={25}/> : <FaAngleDown size={25} />}
                          </ListItemIcon>
                          <ListItemText
                            primary={question.question.title}
                          />
                          <ListItemIcon>
                            <Button
                              color= 'primary'
                              variant = 'contained'
                              onClick={e => {e.stopPropagation(); addToSelectedQuestions(question)}}
                            >
                              Add
                            </Button>
                          </ListItemIcon>
                        </ListItem>
                      </Fade>
                      <Collapse
                        in={openQuestions.indexOf(question) !== -1}
                      >
                        <ListItem component={"div"} style={{display:'flex'}}>
                          <QuizQuestion
                            question={question}
                            variant='quizSelectionPreview'
                          />
                        </ListItem>
                      </Collapse>
                    </div>
                  )
                })}
            </List>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ManualQuizAssignment
