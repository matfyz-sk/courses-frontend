import React, { useState } from 'react'
import { Box, Collapse, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import QuizQuestion from '../../common/quiz-question'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import WarningMessage from '../../common/warning-message'
import { formatDateTime } from '../../common/functions/common-functions'
import { QuizAssignmentTypesEnums } from '../../common/functions/type-enums'

function intersection(a, b) {
  return a.filter((value) => b.map(val => {return val.id}).indexOf(value.id) !== -1);
}

function QuizOverview({
                        title,
                        description,
                        startDate,
                        endDate,
                        timeLimit,
                        questions,
                        shuffleQuizTake,
                        showResult,
                        showQuestionResult,
                        agentOptionsUsers,
                        agentOptionsTeams,
                        agentsSelected,
                        topicsSelected,
                        topicOptionsCovered,
                        topicOptionsRequired,
                        topicOptionsMentions,
                        showWarning,
                        quizAssignmentMode,
                        generationData,
                        pointsForGenerated,
                      }) {
  const style = useStyles()

  function pointsSum(){
    return questions.reduce((acc,question) =>  acc+parseInt(question.points,10) ,0)
  }

  const [openCategory, setOpenCategory] = useState([])
  const [openGeneratedTopics, setOpenGeneratedTopic] = useState([])

  const handleOpenGeneratedTopic = (topic) => () => {
    const currentIndex = openGeneratedTopics.indexOf(topic);
    const newOpen = [...openGeneratedTopics];
    if (currentIndex === -1) {
      newOpen.push(topic);
    } else {
      newOpen.splice(currentIndex, 1);
    }
    setOpenGeneratedTopic(newOpen);
  }

  const handleCategoryCollapse = (index) => () => {
    const currentIndex = openCategory.indexOf(index);
    const newOpen = [...openCategory];
    if (currentIndex === -1) {
      newOpen.push(index);
    } else {
      newOpen.splice(currentIndex, 1);
    }
    setOpenCategory(newOpen);
  }

  const generatedListCategory = (topic) => {
    const topicIndex = generationData.map(t => t.id).indexOf(topic.id)
    return (
      <div key={topic.id}>
        <ListItem className={style.options_listHeader} style={{paddingLeft: 10}} button onClick=
          {handleOpenGeneratedTopic(topic)}>
          <ListItemText
            primaryTypographyProps={{ style: { fontSize: 19 } }}
            primary={`${topic.name}  (${generationData[topicIndex].number})`}
          />
          {openGeneratedTopics.indexOf(topic) !== -1 ? <FaAngleUp /> : <FaAngleDown />}
        </ListItem>
        <Collapse
          in={openGeneratedTopics.indexOf(topic) !== -1}
          style={{paddingTop: 4, paddingBottom: 4}}
        >
          {generationData[topicIndex].types[0].all ?
            <ListItem
              key={topicIndex}
            >
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: 17 , color:`${customTheme.palette.info.grey_600}`} }}
                primary={`All question types`}
              />
            </ListItem>
            :
            <List component='div'>
              {generationData[topicIndex].types.map((type) => {
                if (type.id !== -1 && type.number > 0) return (
                  <ListItem
                    key={type.id}
                  >
                    <ListItemText
                      primaryTypographyProps={{ style: { fontSize: 17 } }}
                      primary={`${type.name}  (${type.number})`}
                    />
                  </ListItem>
                )
              })}
            </List>}
        </Collapse>
      </div>
    )
  }

  const listCategory = (title, items, index) => (
    <div>
      <ListItem className={style.options_listHeader} style={{paddingLeft: 10}} button disabled={items.length === 0} onClick=
        {handleCategoryCollapse(index)}>
        <ListItemText
          primaryTypographyProps= {{style:{fontSize: 19 }}}
          primary = {`${title}  (${items.length})`}
        />
        {openCategory.indexOf(index) !== -1 ? <FaAngleUp /> : <FaAngleDown />}
      </ListItem>
      <Collapse
        in={openCategory.indexOf(index) !== -1}
        style={{paddingTop: 4, paddingBottom: 4}}
      >
        <List component="div" >
          {items.map((item) => {
            return (
              <ListItem
                key={item.id}
              >
                <ListItemText
                  primaryTypographyProps={{style: {fontSize: 17}}}
                  primary={item.name}
                />
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </div>
  )

  const getSettingsRow = (option, value) => {
    return (
      <Grid item container direction='row'>
        <Grid item xs={3}>
          <Typography>{option}</Typography>
        </Grid>
        <Grid item>
          <Typography variant='button'>{value}</Typography>
        </Grid>
      </Grid>
    )
  }

  const getInfoTimeItem = (itemName, itemValue, warningValue) => {
    return (
      <Grid item container xs={4} direction="column">
        <Grid item>
          <h5>{itemName}</h5>
        </Grid>
        <Grid item>
          <p>{itemValue}</p>
        </Grid>
        <Grid item>
          <WarningMessage
            text ={warningValue}
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container direction='column' spacing={3}>
      {/* TITLE */}
      <Grid item container direction='column'>
        <Grid item>
          <h5>Title</h5>
        </Grid>
        <Grid item>
          <Typography variant='subtitle1' style={{fontSize: 20}}>{title}</Typography>
        </Grid>
        <Grid item>
          <WarningMessage
            text ={showWarning.title}
          />
        </Grid>
      </Grid>
      {/* desc */}
      <Grid item container direction='column'>
        <Grid item>
          <h5>Description</h5>
        </Grid>
        <Grid item >
          <Typography variant='subtitle1' style={{maxWidth: '100%'}}>{description}</Typography>
        </Grid>
      </Grid>
      {/* START DATE END DATE */}
      <Grid item container direction='row'>
        {getInfoTimeItem("Start date", formatDateTime(startDate), showWarning.startDate)}
        {getInfoTimeItem("End date", formatDateTime(endDate), showWarning.endDate)}
        {getInfoTimeItem(
          "Time limit",
          timeLimit !=='' && (timeLimit === -1 ? "Unlimited" : `${timeLimit} minutes`),
          showWarning.timeLimit
        )}
      </Grid>
      <Grid item container direction='column'>
        <Grid item>
          <h5>Topics</h5>
        </Grid>
        <List className={style.QO_list}>
          {listCategory('Covered topics', intersection(topicOptionsCovered, topicsSelected), 0)}
          {listCategory('Required topics', intersection(topicOptionsRequired, topicsSelected), 1)}
          {listCategory('Mentioned topics', intersection(topicOptionsMentions, topicsSelected), 2)}
        </List>
      </Grid>
      <Grid item container direction='column'>
        <Grid item>
          <h5>Assign to</h5>
        </Grid>
        <List className={style.QO_list}>
          {listCategory('Students', intersection(agentOptionsUsers, agentsSelected), 3)}
          {listCategory('Teams', intersection(agentOptionsTeams, agentsSelected), 4)}
        </List>
      </Grid>
      <Grid item container direction='column' spacing={2}>
        <Grid item>
          <h5>Quiz settings</h5>
        </Grid>
        <Grid item container spacing={2}>
          {getSettingsRow("Quiz assignment type",quizAssignmentMode.name)}
          {quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id &&
          getSettingsRow("Shuffle questions", shuffleQuizTake ? "Yes" : "No")}
          {getSettingsRow("Show total score", showResult ? "Yes" : "No")}
          {getSettingsRow("Show result for questions", showQuestionResult ? "Yes" : "No")}
        </Grid>
      </Grid>
      {quizAssignmentMode.id === QuizAssignmentTypesEnums.manualQuizAssignment.id ?
        <Grid item container direction='column' spacing={0} style={{ marginTop: 20 }}>
          <Grid item>
            <h4>Questions</h4>
            <Box className={`${style.sectionAppbar}`} padding={1}>
              <Box className={`${style.SQ_toolbar} ${style.startSection}`}>
                <Typography style={{ fontSize: 16 }} variant='button'>Number of
                  questions: {questions.length}</Typography>
              </Box>
              <Box className={`${style.SQ_toolbar} ${style.endSection}`}>
                <Typography style={{ fontSize: 16 }} variant='button'>Points for quiz: {pointsSum()}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item container spacing={2} direction='column'>
            {questions.map(question => {
              return (
                <Grid item container key={question.question.id}>
                  <QuizQuestion
                    question={question}
                    variant='quizOverview'
                  />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        :
        <Grid item container direction='column' spacing={0} style={{ marginTop: 20 }}>
          <Grid item>
            <h4>Questions</h4>
            <Box className={`${style.sectionAppbar} ${style.centeredSection}`}>
              <Box className={`${style.SQ_toolbar} ${style.centeredSection}`}>
                <Typography style={{ fontSize: 16 }} variant='button'>Number of
                  questions: {generationData[0].number}</Typography>
              </Box>
              <Box className={`${style.SQ_toolbar} ${style.centeredSection}`}>
                <Typography style={{ fontSize: 16 }} variant='button'>Points per question: {pointsForGenerated}</Typography>
              </Box>
              <Box className={`${style.SQ_toolbar} ${style.centeredSection}`}>
                <Typography style={{ fontSize: 16 }} variant='button'>Total
                  points: {pointsForGenerated * generationData[0].number}</Typography>
              </Box>
            </Box>
            <List className={style.QO_list} style={{maxHeight: 'max-content'}}>
              {generationData[0].all ?
                generatedListCategory(generationData[0])
                :
                generationData.map(topic => {
                  if (topic.id !== -1 && generationData[generationData.map(t => t.id).indexOf(topic.id)].number > 0)
                    return generatedListCategory(topic)
                })
              }
            </List>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default QuizOverview
