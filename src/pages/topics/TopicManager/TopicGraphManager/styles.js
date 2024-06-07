import { makeStyles } from "@material-ui/core/styles"

const useContextMenuStyle = makeStyles(theme => ({
  root: {
    opacity: "0.8",
    background: "white",
    borderStyle: "solid",
    borderWidth: "thin",
    position: "absolute",
    zIndex: "10",
    '& button': {
      border: "none",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      padding: "0.5em",
      textAlign: "left",
      width: "100%",
      alignItems: 'center',
      '&:hover': {
        background: "white",
      }
    }
  }
}));

const useTipsPanelStyle = makeStyles(theme => ({
  root: {
    opacity: "0.8",
    backgroundColor: "white"
  },
  icon: {
    color: "orange"
  }
}))


export { useContextMenuStyle, useTipsPanelStyle }
