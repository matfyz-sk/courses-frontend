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
import { getShortID } from '../../../helperFunctions'
import { getUser } from '../../../components/Auth'
import { useGetUserResultsByTypeQuery, useUpdateUserResultMutation, useNewUserResultMutation } from 'services/result'
import { skipToken } from '@reduxjs/toolkit/dist/query'

function PointsModal(props) {
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
  const [typeId, setTypeId] = useState(skipToken)
  const {data, isSuccess} = useGetUserResultsByTypeQuery({
    id: getShortID(user['@id']),
    typeId: getShortID(typeId)
  })
  const [updateResult, updateResultResult] = useUpdateUserResultMutation()
  const [newUserResult, newUserResultResult] = useNewUserResultMutation()

  if (isSuccess && typeId !== skipToken) {
    if (data && data.length > 0) {
      setForm({
        ...form,
        type: typeId,
        points: data[0].points,
        description: data[0].description,
        reference: data[0].reference,
        update: data[0],
        before: data[0].points,
      })
    } else {
      setForm({ ...form, type: typeId, update: null, before: 0 })
    }
    setLoading(false)
  }

  const changeType = (e) => {
    const typeID = e.target.value !== '' ? e.target.value : null
    if (typeID && typeID !== '') {
      setLoading(true)
      setTypeId(typeId)
    } else {
      setForm({ ...form, type: e.target.value, update: null, before: 0 })
    }
  }

  const toggle = () => setModal(!modal)

  const modifyResultsIfNecessary = () => {
    if (userIndex !== undefined && resultModifier !== undefined) {
      resultModifier(userIndex, form.before, form.points)
    }
  }

  const saveChanges = () => {
    if (form.update) {
      const patch = {
        points: form.points,
        description: form.description,
        reference: form.reference,
      }
      updateResult({
        id: getShortID(form.update['@id']),
        patch
      }).unwrap().then(response => {
        setLoading(false)
        modifyResultsIfNecessary()
        toggle()
      })
    } else {
      setLoading(true)
      const post = {
        courseInstance: courseInstance['@id'],
        hasUser: user['@id'],
        awardedBy: getUser().fullURI,
        type: form.type === '' ? null : form.type,
        points: form.points,
        description: form.description,
        reference: form.reference,
      }
      newUserResult(post).unwrap().then(response => {
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
