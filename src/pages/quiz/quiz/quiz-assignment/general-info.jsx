import React from 'react'
import {Box, Grid, InputAdornment, Switch, TextField, Typography} from '@material-ui/core'
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TopicSelection from './topic-selection'
import AgentSelection from "./agents-selection";
import {grey} from "@material-ui/core/colors";

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
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    if (newValue === '') setTimeLimit('')
    else if (newValue.match(/^\d+$/)) {
      setTimeLimit(parseInt(newValue) === 0 ? '' : newValue)
    }
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
    <Box display='flex' justifyContent='flex-start'>
      <Box width={190} paddingRight={3} style={{borderRight: `2px solid ${grey[400]}`}}>
        <TextField
          size='small'
          variant='outlined'
          value = {timeLimit}
          disabled={unlimitedTime}
          InputProps={{
            endAdornment:
              <InputAdornment
                position='end'>
                minutes
              </InputAdornment>,
          }}
          inputProps={{
            min: 0,
            maxLength: 4,
            style: {textAlign: 'center'}
          }}
          onChange={e => handleTimeLimitChange(e)}
        />
      </Box>
      <Box paddingLeft={3}>
        <Typography variant='button'>Unlimited</Typography>
        <Switch
          color="primary"
          checked={unlimitedTime}
          onChange={handleSwitchChange}
        />
      </Box>
    </Box>
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
