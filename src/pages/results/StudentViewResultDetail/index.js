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


function StudentViewResultDetail(props) {
    const { result} = props
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
      id: result? result._id : "",
      type: result? result.type : "",
      points: result? result.points : 0,
      description: result? result.description : "",
      reference: result? result.reference : "",
    })  
    
    const toggle = () => setModal(!modal)
    

    return (
        <>
          <Button size="sm" onClick={() => toggle()}>
            Detail
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              {`Details${form.type? " of " + form.type.name : ""}`}
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="points">Points:</Label>
                  <p>{form.points}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description:</Label>
                  <p>{form.description? form.description : ""}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="reference">Reference:</Label>
                  <p>http(s):// { form.reference? form.reference : ""}</p>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
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
  
  export default withRouter(connect(mapStateToProps)(StudentViewResultDetail))