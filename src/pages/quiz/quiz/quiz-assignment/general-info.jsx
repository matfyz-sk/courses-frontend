import React from 'react'
import {Grid, InputAdornment, Switch, TextField} from '@material-ui/core'
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TopicSelection from './topic-selection'
import AgentSelection from "./agents-selection";

function GeneralInfo({
                       courseName,
                       title,
                       setTitle,
                       description,
                       setDescription,
                       startDate,
                       setStartDate,
                       endDate,
                       setEndDate,
                       unlimitedTime,
                       setUnlimitedTime,
                       timeLimit,
                       setTimeLimit,
                       agentOptionsUsers,
                       agentOptionsTeams,
                       agentsSelected,
                       setAgentsSelected,
                       topicsSelected,
                       setTopicsSelected,
                       topicOptionsCovered,
                       topicOptionsRequired,
                       topicOptionsMentions,

                     }) {

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleTimeLimitChange = (event) => {
    event.target.value.length < 6 && event.target.value[0] !== '0' &&
    setTimeLimit(event.target.value)
  }

  const handleSwitchChange = (event) => {
    setUnlimitedTime(event.target.checked)
  }

  const titleTextField = () => (
    <TextField
      fullWidth
      variant='outlined'
      size='small'
      value = {title}
      onChange={e => handleTitleChange(e)}
    />
  )

  const descriptionTextField = () => (
    <TextField
      fullWidth
      multiline
      rows = {3}
      rowsMax={15}
      variant='outlined'
      size='small'
      value = {description}
      onChange={e => handleDescriptionChange(e)}
    />
  )

  const datePicker = (dateData, setDateData) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        size="small"
        variant='inline'
        inputVariant='outlined'
        format='dd.MM.yyyy HH:mm'
        ampm={false}
        autoOk
        value={dateData}
        onChange={setDateData}
      />
    </MuiPickersUtilsProvider>
  )

  const timeLimitSection = () => (
    <Grid item container direction='row' xs={6}>
      <Grid item xs={5}>
        <TextField
          type='number'
          variant='outlined'
          size='small'
          value = {timeLimit}
          InputProps={{
            endAdornment:
              <InputAdornment
                position='end'>
                minutes
              </InputAdornment>,
            inputProps: {
              min: 2,
              max: 10000,
              style: {textAlign:'center'}
            }
          }}
          disabled={unlimitedTime}
          onChange={e => handleTimeLimitChange(e)}
        />
      </Grid>
      <Grid item container alignItems='center' spacing={1} xs={4}>
        <Grid item>
          Unlimited
        </Grid>
        <Grid item>
          <Switch
            color="primary"
            checked={unlimitedTime}
            onChange={handleSwitchChange}
          />
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Grid container direction='column' spacing={3}>
      <Grid item container direction='column'>
        {/* TITLE */}
        <Grid item>
          <h5>Title</h5>
        </Grid>
        <Grid item>
          {titleTextField()}
        </Grid>
      </Grid>
      <Grid item container direction='column'>
        {/* Description */}
        <Grid item>
          <h5>Description</h5>
        </Grid>
        <Grid item>
          {descriptionTextField()}
        </Grid>
      </Grid>
      {/* START DATE END DATE */}
      <Grid item container direction='row' spacing={3}>
        <Grid item container xs={6} direction='column'>
          <Grid item>
            <h5>Start date</h5>
          </Grid>
          <Grid item>
            {datePicker(startDate, setStartDate)}
          </Grid>
        </Grid>
        <Grid item container xs={6} direction="column">
          <Grid item>
            <h5>End date</h5>
          </Grid>
          <Grid item>
            {datePicker(endDate, setEndDate)}
          </Grid>
        </Grid>
      </Grid>
      {/* TIME LIMIT */}
      <Grid item container direction='column'>
        <Grid item>
          <h5>Time limit</h5>
        </Grid>
        {timeLimitSection()}
      </Grid>
      <Grid item>
        <TopicSelection
          courseName = {courseName}
          topicsSelected = {topicsSelected}
          setTopicsSelected = {setTopicsSelected}
          topicOptionsCovered = {topicOptionsCovered}
          topicOptionsRequired = {topicOptionsRequired}
          topicOptionsMentions = {topicOptionsMentions}
        />
      </Grid>
      <Grid item>
        <AgentSelection
          courseName = {courseName}
          agentOptionsUsers={agentOptionsUsers}
          agentOptionsTeams={agentOptionsTeams}
          agentsSelected={agentsSelected}
          setAgentsSelected={setAgentsSelected}
        />
      </Grid>
    </Grid>
  )

}

export default GeneralInfo
