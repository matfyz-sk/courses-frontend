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
      display: "block",
      padding: "0.5em",
      textAlign: "left",
      width: "100%",
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

const useCustomNodeStyle = makeStyles(theme => ({
  root: props => ({
    border: props.border || '2px solid darkgrey',
    borderRadius: '50%',
    background: props.background || 'lightyellow',
    textAlign: 'center',
    padding: '20px 10px',
    width: 200,
    height: 100,
  }),
  name: {
    border: 'none',
    color: '#777',
    fontSize: 14,
    justifySelf: 'center',
    paddingBottom: 10,
    marginBottom: 0,
  },
  description: {
    fontSize: 7,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 20px 50px',
  },
}));


export { useContextMenuStyle, useTipsPanelStyle, useCustomNodeStyle }
