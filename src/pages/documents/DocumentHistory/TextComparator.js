import { MdChevronRight } from "react-icons/md";
import React from "react";
import "./diff.css"

export default function TextComparator({ textA, textB }) {
    if (textB?.length === 0 || textA === textB) {
        return <p>{textA}</p>
    }

    return (
        <p>
            <del style={{ wordBreak: "break-all", whiteSpace: "normal" }} className="revisions-diff">
                {textB}
            </del>
            <MdChevronRight
                size={28}
                style={{
                    color: "grey",
                    margin: "0 1em 0 1em",
                }}
            />
            <ins style={{ wordBreak: "break-all", whiteSpace: "normal" }} className="revisions-diff">
                {textA}
            </ins>
        </p>
    )
}