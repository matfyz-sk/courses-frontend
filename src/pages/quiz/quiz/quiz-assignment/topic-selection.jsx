import React, { useState } from 'react'
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import { FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa'
import { Skeleton } from '@material-ui/lab'
import { intersection, not, union } from '../../common/functions/common-functions'

function TopicSelection({
                          courseName,
                          topicsSelected,
                          setTopicsSelected,
                          topicOptionsCovered,
                          topicOptionsRequired,
                          topicOptionsMentions,
                          loadedQuestions,
                        }) {

  const style = useStyles()

  const [ openCategory, setOpenCategory ] = useState([])

  const handleCategoryCollapse = (index) => () => {
    const currentIndex = openCategory.indexOf(index);
    const newOpen = [ ...openCategory ];
    if(currentIndex === -1) {
      newOpen.push(index);
    } else {
      newOpen.splice(currentIndex, 1);
    }
    setOpenCategory(newOpen);
  }

  const handleRemoveSelected = (topic) => {
    const index = topicsSelected.indexOf(topic)
    const newState = [ ...topicsSelected ]
    newState.splice(index, 1)
    setTopicsSelected(newState)
  }

  const handleCheckedTopic = (topic) => {
    const currentIndex = topicsSelected.indexOf(topic)
    const newState = [ ...topicsSelected ]
    if(currentIndex === -1) {
      newState.push(topic)
    } else {
      newState.splice(currentIndex, 1)
    }
    setTopicsSelected(newState)
  }

  const handleCheckedCategory = (topics) => {
    setTopicsSelected(prevState => intersection(prevState, topics).length === topics.length ? not(prevState, topics) : union(prevState, topics))
  }

  const topicCategory = (title, topics, index) => {
    return (
      <Box width='100%'>
        { loadedQuestions ?
          <ListItem className={ style.options_listHeader } button onClick=
            { handleCategoryCollapse(index) }>
            <ListItemIcon>
              <Checkbox
                checked={ topicsSelected.length > 0 && topics.length > 0 && intersection(topicsSelected, topics).length === topics.length }
                indeterminate={ intersection(topics, topicsSelected).length > 0 && intersection(topics, topicsSelected).length < topics.length }
                onClick={ e => {
                  e.stopPropagation()
                  handleCheckedCategory(topics)
                } }
              />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={ {style: {fontSize: 19}} }
              primary={ title }
            />
            { openCategory.indexOf(index) !== -1 ? <FaAngleUp/> : <FaAngleDown/> }
          </ListItem>
          :
          <Skeleton variant='rect' width='100%' animation="wave" className={ style.options_listHeader }>
            <ListItem className={ style.options_listHeader }>
              <ListItemIcon>
                <Checkbox/>
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={ {style: {fontSize: 19}} }
                primary="Dummy skeleton"
              />
            </ListItem>
          </Skeleton>
        }
        <Collapse
          in={ openCategory.indexOf(index) !== -1 }
          style={ {paddingTop: 4, paddingBottom: 4} }
        >
          <List component="div">
            { topics.length > 0 ?
              topics.map((topic) => {
                return (
                  <ListItem
                    button
                    key={ topic.id }
                    onClick={ e => handleCheckedTopic(topic) }
                  >
                    <ListItemIcon>
                      <Checkbox
                        color='primary'
                        checked={ topicsSelected.indexOf(topic) !== -1 }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={ {style: {fontSize: 17}} }
                      primary={ topic.name }
                    />
                  </ListItem>
                )
              }) :
              <ListItem>
                <ListItemText
                  secondary={ `This course has no ${ title }` }
                />
              </ListItem>
            }
          </List>
        </Collapse>
      </Box>
    )
  }

  return (
    <Grid item container direction='column'>
      <Grid item>
        <h5>Topics</h5>
      </Grid>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 6 }>
          <Card variant='outlined'>
            <CardHeader
              subheader={ courseName }
            />
            <Divider/>
            <List className={ style.options_list }>
              { topicCategory('Covered topics', topicOptionsCovered, 0) }
              { topicCategory('Required topics', topicOptionsRequired, 1) }
              { topicCategory('Mentioned topics', topicOptionsMentions, 2) }
            </List>
          </Card>
        </Grid>
        <Grid item xs={ 6 }>
          <Card variant='outlined'>
            <CardHeader
              title='Selected'
              titleTypographyProps={ {style: {fontSize: 19}} }
            />
            <Divider/>
            <List className={ style.options_list }>
              {
                topicsSelected.map((topic) => {
                  return (
                    <ListItem button key={ topic.id }>
                      <ListItemText primary={ topic.name }/>
                      <IconButton
                        onClick={ e => handleRemoveSelected(topic) }
                      >
                        <FaTimes
                          fontSize='medium'
                          color={ customTheme.palette.error.main }
                        />
                      </IconButton>
                    </ListItem>
                  )
                }) }
            </List>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )

}

export default TopicSelection
