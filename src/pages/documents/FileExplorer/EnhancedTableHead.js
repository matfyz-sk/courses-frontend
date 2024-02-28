import { TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import React from "react"

const headCells = [
    {
        id: "type",
        disableSort: true,
        numeric: false,
        disablePadding: true,
        label: "",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
    {
        id: "createdAt",
        numeric: true,
        disablePadding: false,
        label: "Last changed",
    },
    {
        id: "actionsButton",
        disableSort: true,
        numeric: true,
        disablePadding: false,
        label: "Actions",
    },
]

export default function EnhancedTableHead({ classes, order, orderBy, onRequestSort, hasActionColumn }) {
    const createSortHandler = property => event => {
        onRequestSort(event, property)
    }

    const prepareHeadCells = headCells => {
        if (!hasActionColumn) return headCells.slice(0, -1)
        return headCells
    }

    return (
        <TableHead style={{ position: "static" }}>
            <TableRow style={{ position: "static" }}>
                {prepareHeadCells(headCells).map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {!headCell.disableSort ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : "asc"}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}
