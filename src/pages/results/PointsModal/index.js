import React, {useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, ModalHeader, Button, ModalFooter, ModalBody, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

const PointsModal = props => {
  const { user } = props
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  return (
    <>
      <Button size="sm" onClick={() => toggle()}>
        Add points
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add points to student Patrik Hudák?</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="points">How many points? *</Label>
              <Input type="text" name="points" id="points" placeholder="e.g. 12" />
            </FormGroup>
            <FormGroup>
              <Label for="resultType">Select result type</Label>
              <Input type="select" name="select" id="resultType">
                <option value="">Without type</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="text" id="description" />
            </FormGroup>
            <FormGroup>
              <Label for="reference">Reference</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>http(s)://</InputGroupText>
                </InputGroupAddon>
                <Input type="text" name="text" id="reference" />
              </InputGroup>
            </FormGroup>
          </Form>

        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" onClick={toggle}>Add points</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default PointsModal;
