import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import './DeleteCourseModal.css'
import DeleteForm from "./DeleteForm"

function DeleteCourseModal(props) {
  const [modal, setModal] = useState(false)
  const [redirect, setRedirect] = useState(null)


  const toggle = () => {
    setModal(!modal)
  }

  const callback = () => {
    setRedirect('/courses')
    window.location.reload();
  }

  if (redirect) {
    return <Redirect to={redirect} />
  }

  const { course, courseInstance, type, className, small } = props
  return (
    <div>
      <Button onClick={toggle} className={`delete-button ${small}`}>
        Delete
      </Button>
      {/*<span onClick={this.toggle} className="edit-delete-buttons">*/}
      {/*  Delete*/}
      {/*</span>*/}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
      >
        <ModalHeader toggle={toggle}>{course.name}</ModalHeader>
        <ModalBody>
          <DeleteForm
            course={course}
            courseInstance={courseInstance}
            type={type}
            callback={callback}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default DeleteCourseModal
