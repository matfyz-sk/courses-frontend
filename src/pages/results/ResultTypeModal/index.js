import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, ModalHeader, Button, ModalFooter, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'

const ResultTypeModal = props => {
  const { resultType } = props
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  return (
    <>
      <Button
        color={resultType ? 'link' : 'primary'}
        size="sm"
        className={resultType ? 'text-right' : 'float-right mb-3'}
        onClick={() => toggle()}
      >
        {resultType ? 'Change' : 'New result type'}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {resultType ? 'Change result type?' : 'Add result type to course?'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name of result type *</Label>
              <Input type="text" name="name" id="name" placeholder="e.g. Midterm" />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description" />
            </FormGroup>
            <FormGroup>
              <Label for="minPoints">Minimum points to pass</Label>
              <Input type="number" name="text" id="minPoints" />
            </FormGroup>
            <FormGroup>
              <Label for="resultType">Result type is correction for</Label>
              <Input type="select" name="select" id="resultType">
                <option value="">Without correction</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" onClick={toggle}>Create result type</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ResultTypeModal;
