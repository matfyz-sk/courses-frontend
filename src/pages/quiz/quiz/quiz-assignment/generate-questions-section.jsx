import React, {useState} from 'react'
import {
  Box, Grid, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Switch,
  Tab, Tabs, TextField,
} from '@material-ui/core'
import {useStyles, theme} from '../../common/styles'
import {QuestionTypesEnums} from "../../question/question/question-new-data";

function GenerateQuestionsSection({
                                    topicsSelected,
                                    availableQuestions,
                                  }) {

  const style = useStyles()

  const [openedTab, setOpenedTab] = useState('topics')

  const topicTab = () => (
    <Box paddingLeft={3} width='100%'>
      <List>
        <ListItem>
          <ListItemText primary='All topics'/>
          <ListItemIcon>
            <Switch
              checked={true}
              color='primary'/>
          </ListItemIcon>
        </ListItem>
        {topicsSelected.map(topic => {
          return (
            <ListItem
              key={topic.id}
              className = {style.MQA_questionItem}
              disabled={availableQuestions.reduce((acc,question) =>
                question.question.topic === topic.id ? ++acc : acc, 0) === 0}
            >
              <ListItemText
                primary={topic.name}
              />
              <Box
                display='flex'
                justifyContent='flex-end'
                alignItems = 'center'
              >
                Number of questions:
                <TextField
                  size = 'small'
                  variant='outlined'
                  className={style.GS_numberTextField}
                  InputProps={{
                    endAdornment:
                      <InputAdornment
                        style = {{color: "#818181"}}
                        position='end'>
                        / {availableQuestions.reduce((acc,question) => question.question.topic === topic.id ? ++acc : acc, 0)}
                      </InputAdornment>,
                    inputProps: {
                      min: 0,
                      maxLength: 4,
                      style: { textAlign: 'center', padding: 8 }
                    }
                  }}
                  onClick = {e => e.stopPropagation()}

                />
              </Box>
            </ListItem>
          )})}
      </List>
    </Box>
  )

  const typeTab = () => (
    <Box paddingLeft={3} width='100%'>
      <List>
        <ListItem>
          <ListItemText primary='All types'/>
          <ListItemIcon>
            <Switch
              checked={true}
              color='primary'/>
          </ListItemIcon>
        </ListItem>
        {Object.values(QuestionTypesEnums).map(type => {
          return (
            <ListItem
              key={type.id}
              className = {style.MQA_questionItem}
              // disabled={availableQuestions.reduce((acc,question) =>
              //   question.question.topics.some(t => t['@id'] === topic.id) ? ++acc : acc, 0) === 0}
            >
              <ListItemText
                primary={type.name}
              />
              <Box
                display='flex'
                justifyContent='flex-end'
                alignItems = 'center'
              >
                # of questions:
                <TextField
                  size = 'small'
                  variant='outlined'
                  className={style.GS_numberTextField}
                  InputProps={{
                    endAdornment:
                      <InputAdornment
                        style = {{color: "#818181"}}
                        position='end'>
                        / {availableQuestions.reduce((acc,question) => question.question.questionType === type.id ? ++acc : acc, 0)}
                      </InputAdornment>,
                    inputProps: {
                      min: 0,
                      maxLength: 4,
                      style: { textAlign: 'center', padding: 8 }
                    }
                  }}
                  onClick = {e => e.stopPropagation()}

                />
              </Box>
            </ListItem>
          )})}
      </List>
    </Box>
  )

  const handleTabChange = (e, value) => {
    setOpenedTab(value);
  }

  return (
    <div>
      <div style={{display: 'flex'}}>
        <Tabs
          orientation='vertical'
          value={openedTab}
          onChange={handleTabChange}
          variant='fullWidth'
          style={{
            width:'20%',
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tab
            label="Topics"
            value = 'topics'
          />
          <Tab
            label="Types"
            value = 'types'
          />
        </Tabs>
        {openedTab === 'topics' && topicTab()}
        {openedTab === 'types' && typeTab()}

      </div>
      <Grid container direction='column' style={{paddingTop: 10}}>
        <Grid container item style={{display: 'flex', justifyContent: 'center'}}>
          <p>Number of questions:</p>
        </Grid>
      </Grid>
    </div>
  )
}

export default GenerateQuestionsSection
