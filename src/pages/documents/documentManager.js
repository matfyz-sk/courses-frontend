import React, { useEffect, useState, useCallback } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Button } from 'reactstrap';
import { axiosGetEntities, axiosUpdateEntity, decapitalizeFirstLetter, getResponseBody, getShortID } from 'helperFunctions';
import DocumentRow from './documentRow';


function DocumentsManager(props) {
    const [documents, setDocuments] = useState([])
    const [courseId, setCourseId] = useState(props.match.params.course_id)
    
    const fetchDocuments = useCallback(async () => {
        const url = `document?courseInstance=${courseId}&isDeleted=${props.showingDeleted}`
        axiosGetEntities(url)
            .then(response => getResponseBody(response))
            .then(data => {
                console.log({data})
                setDocuments(data)
            })
    }, [courseId, props.showingDeleted])

    const inverseDeletedFlagOfDocument = (document) => {
        console.log(getShortID(document["@id"]))
        const documentClass = decapitalizeFirstLetter(document["@type"].split("#")[1])
        const url = `${documentClass}/${getShortID(document["@id"])}`

        document.isDeleted = !document.isDeleted // ! not sure about this
        axiosUpdateEntity({isDeleted: document.isDeleted}, url)
            .then(response => {
                if (response.failed === true) {
                    console.error("Houston we got a problem")
                } else {
                    console.log({documents})
                    console.log(documents.filter(doc => doc.isDeleted == props.showingDeleted))
                    setDocuments(documents.filter(doc => doc.isDeleted == props.showingDeleted))
                }
            })
    }
    
    
    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])


    return(
        <>  
            {!props.showingDeleted
                && 
                <Link to={`/courses/${courseId}/documents/deleted`}>
                    <Button>Deleted documents</Button>
                </Link>  
            }          
            <br/>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>doc name</th>
                        <th>delete</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((d, i) =>    
                    <DocumentRow 
                        courseId={courseId}
                        key={i} 
                        document={d}
                        inverseDeletedFlagOfDocument={inverseDeletedFlagOfDocument}
                        showingDeleted={props.showingDeleted}
                    />)
                    }
                </tbody>
            </Table>
        </>
    )
}


const mapStateToProps = ({courseInstanceReducer}) => {
    const { courseInstance } = courseInstanceReducer 
    return {
        courseInstance
    }
}
  
// ! 
export default withRouter(connect(mapStateToProps)(DocumentsManager))
  