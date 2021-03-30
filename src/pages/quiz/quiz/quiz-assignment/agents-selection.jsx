import React, {useState} from 'react'
import {
  Grid,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardHeader,
  Divider,
  Collapse,
  IconButton,
} from '@material-ui/core'
import {useStyles} from '../../common/styles'
import { FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa'

function not(a, b) {
  return a.filter((value) => b.map(val => {return val.id}).indexOf(value.id) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.map(val => {return val.id}).indexOf(value.id) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function AgentSelection ({
                           courseName,
                           agentOptionsUsers,
                           agentOptionsTeams,
                           agentsSelected,
                           setAgentsSelected,
                         }) {

  const style = useStyles()

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

  const handleRemoveSelected = (agent) => {
    const index = agentsSelected.map(a => {return a.id}).indexOf(agent.id)
    const newState = [...agentsSelected]
    newState.splice(index, 1)
    setAgentsSelected(newState)
  }

  const handleCheckedAgent = (agent) => {
    const index = agentsSelected.map(a => {return a.id}).indexOf(agent.id)
    const newState = [...agentsSelected]
    if (index === -1) {
      newState.push(agent)
    } else {
      newState.splice(index, 1)
    }
    setAgentsSelected(newState)
  }

  const handleCheckedCategory = (agents) => {
    setAgentsSelected(prevState => intersection(prevState, agents).length === agents.length ? not(prevState, agents) : union(prevState, agents) )
  }

  const agentCategory = (title, agents, index) => (
    <div>
      <ListItem className={style.options_listHeader} button onClick=
        {handleCategoryCollapse(index)}>
        <ListItemIcon>
          <Checkbox
            checked = {agentsSelected.length > 0 && intersection(agentsSelected, agents).length === agents.length}
            indeterminate = {intersection(agents, agentsSelected).length > 0 && intersection(agents, agentsSelected).length < agents.length}
            onClick = {e => {e.stopPropagation(); handleCheckedCategory(agents)}}
          />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps= {{style:{fontSize: 19 }}}
          primary = {title}
        />
        {openCategory.indexOf(index) !== -1 ? <FaAngleUp /> : <FaAngleDown />}
      </ListItem>
      <Collapse
        className={ openCategory.indexOf(index) !== -1 ? style.options_listItems : null}
        in={openCategory.indexOf(index) !== -1}
      >
        <List component="div" disablePadding>
          {agents.length > 0 ?
            agents.map((agent) => {
              return (
                <ListItem
                  button
                  key={agent.id}
                  onClick={e => handleCheckedAgent(agent)}
                >
                  <ListItemIcon>
                    <Checkbox
                      color='primary'
                      checked={agentsSelected.map(a => {return a.id}).indexOf(agent.id) !== -1}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{style: {fontSize: 17}}}
                    primary={agent.name}
                  />
                </ListItem>
              )}
            ) :
            <ListItem>
              <ListItemText
                secondary={`This course has no ${title}`}
              />
            </ListItem>
          }
        </List>
      </Collapse>
    </div>
  )

  return(
    <Grid item container direction='column'>
      <Grid item>
        <h5>Assign to</h5>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card variant='outlined'>
            <CardHeader
              subheader={courseName}
            />
            <Divider />
            <List className={style.options_list}>
              {agentCategory('students',agentOptionsUsers, 0)}
              {agentCategory('teams',agentOptionsTeams, 1)}
            </List>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card variant='outlined'>
            <CardHeader
              title = 'Selected'
              titleTypographyProps= {{style:{fontSize: 19}}}
            />
            <Divider />
            <List className={style.options_list}>
              {agentsSelected.map((agent) => {
                return (
                  <ListItem button key={agent.id}>
                    <ListItemText primary={
                      agent.type === "http://www.courses.matfyz.sk/ontology#Team" ?
                        `${agent.name} (team)` : agent.name} />
                    <IconButton
                      onClick = {e => handleRemoveSelected(agent)}
                    >
                      <FaTimes
                        fontSize='medium'
                        className={style.options_removeButton}
                      />
                    </IconButton>
                  </ListItem>
                )
              })}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )

}

export default AgentSelection
