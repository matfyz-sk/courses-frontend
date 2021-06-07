import React from 'react'
import { green, grey, red } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core'

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#007423",
      light: green[100],
    },
    secondary: {
      main: "#004603",
      contrastText: grey[50]
    },
    error:{
      main: red[900],
      contrastText: grey[50],
    },
    section:{
      main: grey[200],
      secondary: grey[100],
      darkBorder: grey[300],
    },
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



const useStyles = makeStyles(({
  root: {
    borderWidth: 0,
    marginTop: 20,
    marginBottom: 60,
  },
  sectionRoot:{
    marginBottom: 30,
    marginTop: 30,
  },
  smDownDisplayNone:{
    whiteSpace: 'pre',
    [customTheme.breakpoints.down("sm")]:{
      display: "none",
    }
  },
  centeredSection: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startSection: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  endSection: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sectionHeader:{
    backgroundColor: customTheme.palette.section.main,
    textTransform: 'capitalize',
    padding: 8,
    paddingLeft: 15,
  },
  sectionAppbar:{
    backgroundColor: customTheme.palette.section.secondary,
    border: 0,
    borderBottom:  `2px solid ${customTheme.palette.primary.main}`,
    display:'flex',
  },
  stepLabel: {
    fontSize: '150%',
  },
  stepIcon: {
    fontSize: '190%',
  },
  modeTabSelected:{
    border: `1px solid ${customTheme.palette.primary.main}`,
    borderBottom: 0,
  },
  modeTab:{
    border: 0,
    borderBottom: `1px solid ${customTheme.palette.primary.main}`,
  },
  navButton: {
    margin: 30,
    fontSize: 18,
    textTransform: 'uppercase'
  },
  options_list: {
    position: 'relative',
    overflow: 'auto',
    minHeight: 300,
    maxHeight: 500,
  },
  options_listHeader:{
    border: `1px solid ${customTheme.palette.section.darkBorder}`,
    backgroundColor: customTheme.palette.section.secondary,
    paddingLeft: 5,
  },
  GS_topicItem:{
    display: 'flex',
    marginBottom: 10,
    marginTop: 10,
  },
  GS_topicItemCore:{
    border: `1px solid ${customTheme.palette.section.darkBorder}`,
    minHeight: 60,
    paddingTop: 1,
    paddingBottom: 1,
  },
  GS_topicItemButton:{
    borderRadius: 0,
    boxShadow: 'none',
    minWidth: 'fit-content',
  },
  GS_changeTopicButton:{
    minHeight: 60,
    "&:hover": {
      backgroundColor: customTheme.palette.section.secondary,
    }
  },
  MQA_questionItem:{
    border: `1px solid ${customTheme.palette.section.darkBorder}`,
    marginBottom: 10,
  },
  MQA_questionList:{
    borderWidth: 0,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 800,
  },
  MQA_buttonIcon:{
    fontSize: 19,
    color: customTheme.palette.primary.main
  },
  MQA_optionButton:{
    marginRight:10,
    paddingLeft: 7,
  },
  SQ_toolbar:{
    width: '100%',
    padding: 5,
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  numberTextField:{
    width: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  QO_list: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    borderBottom: `1px solid ${customTheme.palette.section.main}`,
  },
  QQ_root:{
    borderWidth: 0,
    width: '100%',
    padding: 20,
  },
  QQ_questionText:{
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  QQR_questionText:{
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  QO_infoText:{
      // fontStyle: 'italic',
      color: customTheme.palette.text.secondary,
  },
  QT_appbar:{
    position: 'sticky',
    padding: 15,
    width: '100%',
    backgroundColor: grey[50],
    borderBottom: `3px solid ${customTheme.palette.primary.main}`,
    color: customTheme.palette.text.primary,
    fontSize: 20,
  },
  QT_appbarQuestion:{
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
    width: '100%',
    borderBottom: `2px solid ${customTheme.palette.section.darkBorder}`,
    color: customTheme.palette.text.primary,
    marginBottom: 20,
  },
  QTR_question:{
    borderWidth: 0,
    width: '100%',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  QTR_appbarQuestion:{
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    width: '100%',
    borderBottom: `2px solid ${customTheme.palette.primary.main}`,
    color: customTheme.palette.text.primary,
  },
  QTR_appbarQuestion_points:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    width: 'fit-content',
    borderBottom: `2px solid ${customTheme.palette.primary.main}`,
    color: customTheme.palette.text.primary,
  },
  QTR_appbarQuestion_comment:{
    padding: 10,
    width: '100%',
    borderBottom: `2px solid ${customTheme.palette.primary.main}`,
    color: customTheme.palette.text.primary,
  },
  QTR_appbar:{
    position: 'sticky',
    padding: 20,
    width: '100%',
    backgroundColor: grey[100],
    borderBottom: `2px solid ${customTheme.palette.primary.main}`,
    color: customTheme.palette.text.primary,
    fontSize: 20,
  },
}));

export {customTheme, useStyles}
