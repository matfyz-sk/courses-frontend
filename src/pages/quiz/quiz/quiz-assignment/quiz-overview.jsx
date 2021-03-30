import React, {useState} from "react";
import {
  Box,
  Collapse,
  Grid, List,
  ListItem,
  ListItemText, Typography
} from "@material-ui/core";
import {useStyles} from '../../common/styles';
import QuizQuestion from "../../common/quiz-question";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";
import WarningMessage from "../../common/warning-message";

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
                        agentOptionsUsers,
                        agentOptionsTeams,
                        agentsSelected,
                        topicsSelected,
                        topicOptionsCovered,
                        topicOptionsRequired,
                        topicOptionsMentions,
                        showWarning,
                      }) {
  const style = useStyles()

  function formatDateTime(date){
    const datetime = new Date(date)
    return `${datetime.getDate()}.${datetime.getMonth()+1}.${datetime.getFullYear()} ${datetime.getHours()}:${String(datetime.getMinutes()).padStart(2, "0")}`
  }

  function pointsSum(){
    return questions.reduce((acc,question) =>  acc+parseInt(question.points,10) ,0)
  }

  const [openCategory, setOpenCategory] = useState([])

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

  const listCategory = (title, items, index) => (
    <div>
      <ListItem className={style.QO_listHeader} button disabled={items.length === 0} onClick=
        {handleCategoryCollapse(index)}>
        <ListItemText
          primaryTypographyProps= {{style:{fontSize: 19 }}}
          primary = {`${title}  (${items.length})`}
        />
        {openCategory.indexOf(index) !== -1 ? <FaAngleUp /> : <FaAngleDown />}
      </ListItem>
      <Collapse
        in={openCategory.indexOf(index) !== -1}
      >
        <List component="div" disablePadding>
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
        <Grid item container xs={4} direction="column">
          <Grid item>
            <h5>Start date</h5>
          </Grid>
          <Grid item>
            <p>{formatDateTime(startDate)}</p>
          </Grid>
          <Grid item>
            <WarningMessage
              text ={showWarning.startDate}
            />
          </Grid>
        </Grid>
        <Grid item container xs={4} direction="column">
          <Grid item>
            <h5>End date</h5>
          </Grid>
          <Grid item>
            <p>{formatDateTime(endDate)}</p>
          </Grid>
          <Grid item>
            <WarningMessage
              text ={showWarning.endDate}
            />
          </Grid>
        </Grid>
        <Grid item container xs={4} direction='column'>
          <Grid item>
            <h5>Time limit</h5>
          </Grid>
          <Grid item>
            {timeLimit!=='' && (timeLimit === -1 ? "Unlimited" : `${timeLimit} minutes`)}
          </Grid>
          <Grid item>
            <WarningMessage
              text ={showWarning.timeLimit}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container direction='column'>
        <Grid item>
          <h5>Topics</h5>
        </Grid>
        <List className={style.QO_list} disablePadding>
          {listCategory('covered topics', intersection(topicOptionsCovered, topicsSelected), 0)}
          {listCategory('required topics', intersection(topicOptionsRequired, topicsSelected), 1)}
          {listCategory('mentioned topics', intersection(topicOptionsMentions, topicsSelected), 2)}
        </List>
      </Grid>
      <Grid item container direction='column'>
        <Grid item>
          <h5>Assign to</h5>
        </Grid>
        <List className={style.QO_list} disablePadding>
          {listCategory('students', intersection(agentOptionsUsers, agentsSelected), 3)}
          {listCategory('teams', intersection(agentOptionsTeams, agentsSelected), 4)}
        </List>
      </Grid>
      <Grid item container direction='column' spacing={0} style={{marginTop: 20}}>
        <Grid item>
          <h4>Questions</h4>
          <Box className={style.sectionAppbar}>
            <Box className={style.SQ_toolbar} style={{justifyContent: 'flex-start', marginLeft: 10}}>
              <Typography style={{fontSize: 17}} variant='button'>
                {shuffleQuizTake ? "Shuffle each quiz take" : "Fixed order of questions"}
              </Typography>
            </Box>
            <Box className={style.SQ_toolbar} style={{justifyContent: 'flex-end', marginRight: 10}}>
              <Typography style={{fontSize: 17}} variant='button'>Total points: {pointsSum()}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item container spacing={2} direction='column'>
          {questions.map(question => {
            return(
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
    </Grid>
  )
}

export default QuizOverview
