import React from 'react'
import {green, red, grey} from '@material-ui/core/colors'
import {makeStyles} from '@material-ui/core/styles'
import {createMuiTheme} from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: green[900],
      contrastText: grey[50]
    },
    error:{
      main: red[900],
      contrastText: grey[50],
      secondary: red[700]
    }
  },
  typography: {
    fontFamily: 'inherit',
  },
  breakpoints: {
    values: {
      md: 1000,
    }
  }
})

const useStyles = makeStyles((theme) => ({
  root:{
    borderWidth: 0,
    marginTop: 20,
    marginBottom: 60,
  },
  sectionRoot:{
    marginBottom: 20,
  },
  smDownDisplayNone:{
    whiteSpace: 'pre',
    [theme.breakpoints.down("sm")]:{
      display: "none",
    }
  },
  sectionHeader:{
    backgroundColor: grey[200],
    borderRadius: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  sectionAppbar:{
    backgroundColor: grey[100],
    border: 0,
    borderBottom:  `2px solid ${green[700]}`,
    display:'flex',
  },
  QA_stepLabel: {
    fontSize: '150%',
  },
  QA_stepIcon: {
    fontSize: '190%',
  },
  QA_tabs: {
    padding: 0,
    backgroundColor: grey[50],
    textTransform: 'capitalize',
  },
  QA_navButtons: {
    display: 'flex',
    justifyContent: 'center',
  },
  QA_navButton: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },
  options_list: {
    position: 'relative',
    overflow: 'auto',
    minHeight: 300,
    maxHeight: 400,
  },
  options_listHeader:{
    border: `1px solid ${grey[300]}`,
    backgroundColor: grey[100],
    marginBottom: 8,
    paddingLeft: 5,
    textTransform: 'capitalize',
  },
  options_listItems: {
    marginBottom: 8,
  },
  options_removeButton:{
    color: red[900]
  },
  GS_numberTextField:{
    minWidth: 100,
    maxWidth: 120,
    marginLeft: 10,
  },
  MQA_questionItem:{
    border: `1px solid ${grey[300]}`,
    marginBottom: 10,
    alignItems: 'center',
  },
  MQA_questionList:{
    borderWidth: 0,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 800,
  },
  MQA_buttonIcon:{
    fontSize: 20,
    marginRight: 5,
  },
  MQA_optionButton:{
    marginRight:10,
    paddingLeft: 7,
  },
  SQ_toolbar:{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    justifyContent:'center',
  },
  SQ_orderButton: {
    margin: 0,
    color: theme.palette.primary.main,
    borderRadius: 5,
    fontSize: 19,
  },
  SQ_removeButton: {
    margin: 0,
    marginLeft: 10,
    color: theme.palette.error.main,
    borderRadius: 5,
    fontSize: 19,
  },
  SQ_pointsTextField:{
    width: 50,
    marginLeft: 7,
    marginRight: 10,
  },
  QO_list: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    borderBottom: `1px solid ${grey[300]}`,
  },
  QO_listHeader:{
    border: `1px solid ${grey[400]}`,
    backgroundColor: grey[50],
    paddingLeft: 15,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  QO_listItems: {
    borderBottom: `1px solid ${grey[300]}`,
  },
  QQ_root:{
    borderWidth: 0,
    width: '100%',
    padding: 10,
  },
  QQ_info:{
    display: 'flex',
    marginBottom: 20,
  },
  QQ_questionText:{
    fontWeight: "bold",
    width: '100%',
    marginBottom: 20,
  },
  QQ_questionTextOverview:{
    fontWeight: "bold",
    width: '50%',
    display: 'flex',
    flexGrow: 1,
  },
  QQ_questionDate:{
    fontStyle: 'italic',
    color: grey[600],
    width: '100%',
  },
  QQ_questionPoints:{
    fontWeight: "bold",
    display: 'flex',
  },
}));

export {theme, useStyles}
