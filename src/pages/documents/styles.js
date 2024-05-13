import { grey, red } from "@material-ui/core/colors"
import { makeStyles } from "@material-ui/core/styles"
import { createMuiTheme } from "@material-ui/core"

const baseTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#007423",
            light: "#28a745",
        },
        secondary: {
            main: "#004603",
            contrastText: grey[50],
        },
        error: {
            main: red[900],
            contrastText: grey[50],
        },
    },
    typography: {
        fontFamily: "inherit",
    },
})

const customTheme = createMuiTheme(
    {
        overrides: {
            MuiCheckbox: {
                colorSecondary: {
                    color: baseTheme.palette.secondary.main,
                    "&$checked": {
                        color: baseTheme.palette.primary.main,
                    },
                },
            },
            MuiButton: {
                root: {
                    "&:focus": {
                        outline: "none", // Remove the outline on focus
                    },
                },
            },
            MuiIconButton: {
                root: {
                    "&:focus": {
                        outline: "none", // Remove the outline on focus
                    },
                },
            },
        },
    },
    baseTheme
)

const useFileExplorerStyles = makeStyles(theme => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
    cell: {
        padding: "6px 2px 6px 12px",
    },
    textCell: {
        whiteSpace: "normal",
        wordBreak: "break-word",
    },
    infoButton: {
        fontSize: "110%",
        color: baseTheme.palette.primary.main,
    },
    actionsButton: {
        fontSize: "175%",
        color: baseTheme.palette.primary.main,
    },
}))

const usePdfRendererStyles = makeStyles({
    input: {
        width: 45,
        "& input[type=number]": {
            "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
})

const useTopicStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        padding: 2,
    },
    iconButton: {
        outline: "none",
    },
    nested: {
        paddingLeft: theme.spacing(3),
    },
    listAdd: {
        borderTop: `1px solid #dadada`,
        borderBottom: `1px solid #dadada`,
    },
    listAddButton: {
        fontSize: "145%",
        display: "block",
        margin: "auto",
    },
    removeButton: {
        fontSize: "85%",
        outline: "none",
    },
    listItemIcon: {
        marginRight: "0.5em",
    },
    selectedTopic: {
        padding: 2,
        backgroundColor: "lightgray",
    },
}))

export { customTheme, useFileExplorerStyles, usePdfRendererStyles, useTopicStyles }
