import React from 'react'
import { Button } from 'reactstrap'

const DocumentRow = props => {
    return (
        <tr>
            <th scope="row">xd</th>
            <td>{props.document.name}</td>
            {/* <td><Link to={`/courses/${props.courseId}/documents/edit/${props.documentId}`}>letsgo</Link></td> */}
            <td>
                <Button onClick={() => props.inverseDeletedFlagOfDocument(props.document)}>
                    {props.showingDeleted ? "restore" :  "delete"}
                </Button>
            </td>
        </tr>
    )
}

export default DocumentRow