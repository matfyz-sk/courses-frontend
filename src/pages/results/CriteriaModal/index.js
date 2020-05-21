import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, ModalHeader, Button, ModalFooter, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'

const CriteriaModal = props => {
  const { grading } = props
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  return (
    <>
      <Button
        color={grading ? 'link' : 'primary'}
        size="sm"
        className={grading ? 'text-right' : 'float-right mb-3'}
        onClick={() => toggle()}
      >
        {grading ? 'Change' : 'New grading'}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {grading ? 'Change grading in course?' : 'Add grading to course?'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="grade">Name of grading *</Label>
              <Input type="text" name="grade" id="grade" placeholder="e.g. A, B, C, ..." />
            </FormGroup>
            <FormGroup>
              <Label for="minPoints">Minimum points to get this grading *</Label>
              <Input type="number" name="minPoints" id="minPoints" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" onClick={toggle}>Create grading</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CriteriaModal;
