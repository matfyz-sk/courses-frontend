import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
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
import { getShortID } from '../../../helperFunctions'
import { createUserResult, getUserByTypeResult, updateUserResult } from '../functions'
import { getUser } from '../../../components/Auth'

const PointsModal = props => {
  const { user, courseInstance, userIndex, resultModifier } = props
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: '',
    points: 0,
    description: '',
    reference: '',
    update: null,
    before: 0,
  })

  function getTypeDetail(type_id) {
    setLoading(true)
    getUserByTypeResult(getShortID(user['@id']), getShortID(type_id)).then(
      data => {
        if (data['@graph'] && data['@graph'].length > 0) {
          setForm({
            ...form,
            type: type_id,
            points: data['@graph'][0].points,
            description: data['@graph'][0].description,
            reference: data['@graph'][0].reference,
            update: data['@graph'][0],
            before: data['@graph'][0].points,
          })
        } else {
          setForm({ ...form, type: type_id, update: null, before: 0 })
        }
        setLoading(false)
      }
    )
  }

  function changeType(e) {
    const typeID = e.target.value !== '' ? e.target.value : null
    if (typeID && typeID !== '') {
      getTypeDetail(typeID)
    } else {
      setForm({ ...form, type: e.target.value, update: null, before: 0 })
    }
  }

  const toggle = () => setModal(!modal)

  function modifyResultsIfNecessary() {
    if (userIndex !== undefined && resultModifier !== undefined) {
      resultModifier(userIndex, form.before, form.points)
    }
  }

  function saveChanges() {
    if (form.update) {
      updateUserResult({
        ...form.update,
        points: form.points,
        description: form.description,
        reference: form.reference,
      }).then(data => {
        if (data.status) {
          setLoading(false)
          modifyResultsIfNecessary()
          toggle()
        }
      })
    } else {
      setLoading(true)
      createUserResult(
        courseInstance['@id'],
        user['@id'],
        getUser().fullURI,
        form.type === '' ? null : form.type,
        form.points,
        form.description,
        form.reference
      ).then(data => {
        setLoading(false)
        modifyResultsIfNecessary()
        toggle()
      })
    }
  }

  const options = []
  options.push(
    <option value="" key="empty-select">
      Without result type
    </option>
  )
  if (courseInstance) {
    for (let i = 0; i < courseInstance.hasResultType.length; i++) {
      options.push(
        <option
          value={courseInstance.hasResultType[i]['@id']}
          key={courseInstance.hasResultType[i]['@id']}
        >
          {courseInstance.hasResultType[i].name}
        </option>
      )
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => toggle()}>
        Add points
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`Add points to student ${user.firstName} ${user.lastName}?`}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="resultType">Select result type</Label>
              <Input
                type="select"
                name="select"
                id="resultType"
                value={form.type}
                disabled={loading}
                onChange={changeType}
              >
                {options}
              </Input>
            </FormGroup>
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
                value={form.description}
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
                  value={form.reference}
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
          <Button color="primary" onClick={saveChanges} disabled={loading}>
            {form.update ? 'Update points' : 'Add points'}
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

export default withRouter(connect(mapStateToProps)(PointsModal))
