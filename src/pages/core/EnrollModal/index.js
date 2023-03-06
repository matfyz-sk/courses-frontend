import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import './EnrollModal.css'
import { EnrollForm } from './EnrollForm'

function EnrollModal(props) {
  const [modal, setModal] = useState(false)
  const {
    course, 
    courseInstance, 
    className, 
    user
  } = props

  const toggle = () => {
    setModal(!modal)
  }

  return (
    <div>
      <Button onClick={ toggle } className="enroll-button">
        Enroll
      </Button>
      <Modal
        isOpen={ modal }
        toggle={ toggle }
        className={ className }
      >
        <ModalHeader toggle={ toggle }>{ course.name }</ModalHeader>
        <ModalBody>
          <EnrollForm courseInstance={ courseInstance } user={ user }/>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={ toggle }>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default EnrollModal
