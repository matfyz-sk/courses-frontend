import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Modal,
  ModalHeader,
  Button,
  ModalFooter,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap'
import { useDeleteResultMutation, useUpdateResultMutation} from 'services/result'


function ResultModal(props) {
    const { result} = props
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updateResult, updateResultInfo] = useUpdateResultMutation()
    const [deleteResult, deleteResultInfo] = useDeleteResultMutation()
    //const [createResultPart, createResultPartInfo] = useNewResultPartMutation()
    const [form, setForm] = useState({
      id: result? result._id : "",
      type: result? result.type : "",
      points: result? result.points : 0,
      description: result? result.description : "",
      reference: result? result.reference : "",
    })  
    
    const toggle = () => setModal(!modal)
    
    

    const updateStudentResult = () => {
        const body = {
            points: form.points,
            description: form.description,
            reference: form.reference,
        }
        updateResult({
            id: form.id,
            body
          }).unwrap().then(response => {
            if (response){  
                setLoading(false)
                toggle()
                
            }else{
                console.log("RESULT COULD NOT BE UPDATED!")
            }
          }).catch(error => console.log(error))
    }

    const deleteStudentResult = () => {
        deleteResult(
            form.id
            ).unwrap().then(response => {
            if (response){  
                setLoading(false)
                toggle()
                
            }else{
                console.log("RESULT COULD NOT BE DELETED!")
                toggle()
            }
          }).catch(error => console.log(error))
    }

    return (
        <>
          <Button size="sm" onClick={() => toggle()}>
            Detail
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              {`Edit details of ${form.type ? form.type.name : "this result"}?`}
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="points">How many points? *</Label>
                  <Input
                    type="text"
                    name="points"
                    id="points"
                    placeholder="e.g. 12"
                    value={form.points}
                    disabled={loading}
                    onChange={e =>
                      setForm({
                        ...form,
                        points: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={form.description? form.description : ""}
                    disabled={loading}
                    onChange={e =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="reference">Reference</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>http(s)://</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      name="reference"
                      id="reference"
                      value={form.reference? form.reference : ""}
                      disabled={loading}
                      onChange={e =>
                        setForm({
                          ...form,
                          reference: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" onClick={updateStudentResult} disabled={loading}>
                Update
              </Button>
              <Button color="danger" onClick={deleteStudentResult} disabled={loading}>
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )
}



const mapStateToProps = ({ courseInstanceReducer }) => {
    const { courseInstance } = courseInstanceReducer
    return {
      courseInstance,
    }
  }
  
  export default withRouter(connect(mapStateToProps)(ResultModal))