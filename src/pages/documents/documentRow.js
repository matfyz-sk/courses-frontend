import React from 'react'
import { withRouter } from 'react-router'
import { getShortID } from 'helperFunctions'
import { Link } from 'react-router-dom'
import { timestampToString2 } from 'helperFunctions'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import { MdEdit, MdHistory, MdDelete, MdRestorePage } from "react-icons/md"

// FIXME style conventionally
const ICON_SIZE = 28
const ICON_COLOR = "#237a23"

const DocumentRow = props => {
    return (
        <tr>
            <td style={{fontWeight: "bold"}}>{props.document.name}</td>
            <td>{timestampToString2(props.document.createdAt)}</td>
            <td style={{textAlign: "right"}}>
                {!props.showingDeleted && (
                    <>
                        <Link 
                            to={redirect(ROUTES.EDIT_DOCUMENT,  [
                                { key: 'course_id', value: props.match.params.course_id },
                                { key: 'document_id', value: getShortID(props.document["@id"]) }
                            ])}
                            >
                            <MdEdit style={{color: ICON_COLOR, marginRight: "2em"}} size={ICON_SIZE}/>
                        </Link>
                        <Link 
                            to={redirect(ROUTES.DOCUMENT_HISTORY,  [
                                { key: 'course_id', value: props.match.params.course_id },
                                { key: 'document_id', value: getShortID(props.document["@id"]) }
                            ])}
                            >
                            <MdHistory style={{color: ICON_COLOR, marginRight: "2em"}} size={ICON_SIZE}/>
                        </Link>
                    </>                    
                )}
                 <Link to={{}} onClick={() => props.invertDeletionFlag(props.document)}>
                    {props.showingDeleted
                     ? <MdRestorePage style={{color: ICON_COLOR}} size={ICON_SIZE}/>
                     :  <MdDelete style={{color: ICON_COLOR}} size={ICON_SIZE}/>}
                </Link>
            </td>
        </tr>
    )
}

export default withRouter(DocumentRow)