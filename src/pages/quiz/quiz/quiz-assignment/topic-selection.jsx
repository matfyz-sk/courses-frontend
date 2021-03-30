import React, {useState} from 'react'
import {
  Grid, Checkbox, List, ListItem, ListItemText, ListItemIcon, Card, CardHeader, Divider, Collapse, IconButton,
} from '@material-ui/core'
import {useStyles} from '../../common/styles'
import { FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa'

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function TopicSelection ({
                           courseName,
                           topicsSelected,
                           setTopicsSelected,
                           topicOptionsCovered,
                           topicOptionsRequired,
                           topicOptionsMentions,
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

  const handleRemoveSelected = (topic) => {
    const index = topicsSelected.indexOf(topic)
    const newState = [...topicsSelected]
    newState.splice(index, 1)
    setTopicsSelected(newState)
  }

  const handleCheckedTopic = (topic) => {
    const currentIndex = topicsSelected.indexOf(topic)
    const newState = [...topicsSelected]
    if (currentIndex === -1) {
      newState.push(topic)
    } else {
      newState.splice(currentIndex, 1)
    }
    setTopicsSelected(newState)
  }

  const handleCheckedCategory = (topics) => {
    setTopicsSelected(prevState => intersection(prevState, topics).length === topics.length ? not(prevState, topics) : union(prevState, topics) )
  }

  const topicCategory = (title, topics, index) => (
    <div>
      <ListItem className={style.options_listHeader} button onClick=
        {handleCategoryCollapse(index)}>
        <ListItemIcon>
          <Checkbox
            checked = {topicsSelected.length > 0 && topics.length > 0 && intersection(topicsSelected, topics).length === topics.length}
            indeterminate = {intersection(topics, topicsSelected).length > 0 && intersection(topics, topicsSelected).length < topics.length}
            onClick = {e => {e.stopPropagation(); handleCheckedCategory(topics)}}
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
          {topics.length > 0 ?
            topics.map((topic) => {
              return (
                <ListItem
                  button
                  key= {topic.id}
                  onClick={e => handleCheckedTopic(topic)}
                >
                  <ListItemIcon>
                    <Checkbox
                      color = 'primary'
                      checked = {topicsSelected.indexOf(topic) !== -1}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps = {{style:{fontSize: 17}}}
                    primary={topic.name}
                  />
                </ListItem>
              )
            }) :
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
        <h5>Topics</h5>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card variant='outlined'>
            <CardHeader
              subheader={courseName}
            />
            <Divider/>
            <List className={style.options_list}>
              {topicCategory('covered topics', topicOptionsCovered, 0)}
              {topicCategory('required topics', topicOptionsRequired, 1)}
              {topicCategory('mentioned topics', topicOptionsMentions, 2)}
            </List>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant='outlined'>
            <CardHeader
              title='Selected'
              titleTypographyProps={{style: {fontSize: 19}}}
            />
            <Divider/>
            <List className={style.options_list}>
              {
                topicsSelected.map((topic) => {
                  return (
                    <ListItem button key={topic.id}>
                      <ListItemText primary={topic.name}/>
                      <IconButton
                        onClick={e => handleRemoveSelected(topic)}
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

export default TopicSelection
