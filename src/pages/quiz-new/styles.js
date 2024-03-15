import { makeStyles } from '@material-ui/core/styles'
import {
  Accordion,
  Checkbox,
  createTheme,
  withStyles,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { grey, red } from '@material-ui/core/colors'
import React from 'react'
import TextField from '@material-ui/core/TextField'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#007423',
      light: '#28a745',
    },
    secondary: {
      main: '#004603',
      contrastText: grey[50],
    },
    background: {
      main: '#eafaee',
    },
    error: {
      main: red[900],
      contrastText: grey[50],
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
})

const customQuizTheme = createTheme({
  overrides: {
    MuiAccordion: {
      root: {
        expanded: {
          margin: 'auto',
        },
      },
    },
    MuiCheckbox: {
      root: {
        checked: {
          color: 'green',
        },
      },
      checked: {},
    },
  },
})
const useNewQuizStyles = makeStyles(theme => ({
  quizMain: {
    margin: '50px',
  },
  quizNewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
  },
  questionAccordionItem: {
    width: '90%',
    margin: 'auto',
  },
  questionListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '10px',
  },
  accordionContentLeft: {
    width: '50%',
  },
  accordionContentRight: {
    display: 'flex',
    width: '50%',
    flexDirection: 'column',
    rowGap: '10px',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  questionAnswerField: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '20px',
  },
  container: {
    margin: '50px',
  },
  questionTextField: {
    width: '100%',
  },
  answerTextField: {
    width: '100%',
  },
  questionAnswers: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    marginBottom: '20px',
  },
  addAnswerButton: {
    width: 'fit-content',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  commentBox: {
    borderRadius: '5px',
    boxShadow: '1px 1px 3px gray',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: baseTheme.palette.background.main,
  },
  commentContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  commentReplyButton: {
    color: baseTheme.palette.primary.main,
    textDecoration: 'underline',
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
    '&:hover': {
      color: baseTheme.palette.secondary.main,
    },
  },
  commentReplyBox: {
    marginLeft: '50px',
  },
}))

const CustomAccordion = withStyles({
  root: {
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(Accordion)

const GreenCheckbox = withStyles({
  root: {
    color: baseTheme.palette.secondary.main,
    '&$checked': {
      color: baseTheme.palette.secondary.main,
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />)

const CustomTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: baseTheme.palette.secondary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: baseTheme.palette.secondary.main,
      },
    },
  },
})(TextField)

const GreenButton = withStyles({
  root: {
    color: 'white',
    backgroundColor: baseTheme.palette.primary.main,
    '&:hover': {
      backgroundColor: baseTheme.palette.secondary.main,
    },
  },
})(Button)

const GreenCircularProgress = withStyles({
  root: {
    color: baseTheme.palette.primary.light,
  },
})(CircularProgress)

export {
  baseTheme,
  customQuizTheme,
  useNewQuizStyles,
  CustomAccordion,
  GreenCheckbox,
  CustomTextField,
  GreenButton,
  GreenCircularProgress,
}
