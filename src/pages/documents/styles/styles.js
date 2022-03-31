import { grey, red } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core'

const baseTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#007423",
      light: "#28a745",
    },
    secondary: {
      main: "#004603",
      contrastText: grey[50]
    },
    error: {
      main: red[900],
      contrastText: grey[50],
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  breakpoints: {
    values: {
      md: 1000,
    }
  },
})

const customTheme = createMuiTheme({
  overrides: {
    MuiCheckbox: {
      colorSecondary: {
        color: baseTheme.palette.secondary.main,
        '&$checked': {
          color: baseTheme.palette.primary.main,
        },
      },
    },
  },
}, baseTheme)

const useStyles = makeStyles(({
  icons: {
    fontSize: "400%",
  }
}))

const useFileExplorerStyles = makeStyles(({
  info: {
    fontSize: "120%",
    color: baseTheme.palette.primary.main
  },
  actions: {
    fontSize: "175%",
    color: baseTheme.palette.primary.main
  }
}))

export {customTheme, useStyles, useFileExplorerStyles}
