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
import { getUser } from '../../../components/Auth'
import { useGetResultQuery, useUpdateResultMutation, useNewResultMutation} from 'services/result'
import { skipToken } from '@reduxjs/toolkit/dist/query'

function PointsModal(props) {
  const { user, courseInstance, userIndex, resultModifier } = props
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    id: '',
    type: '',
    points: 0,
    description: '',
    reference: '',
    update: null,
    before: 0,
  })
  //const [partsForm, setPartsForm] = useState([])
  const [typeId, setTypeId] = useState(skipToken)
  const {data, isSuccess, err} = useGetResultQuery({
    userId: user._id,
    courseInstanceId: courseInstance._id,
  },{skip: !courseInstance})

  const [updateResult, updateResultResult] = useUpdateResultMutation()
  const [newUserResult, newUserResultResult] = useNewResultMutation()


  if (isSuccess && typeId !== skipToken) {
    if (data && data.length > 0) {
      setForm({
        ...form,
        type: typeId,
        points: data[0].points,
        description: data[0].description,
        reference: data[0].reference,
        update: null,
        before: data[0].points,
      })

    } else {
      setForm({ ...form, type: typeId, update: null, before: 0 })
    }
    setLoading(false)
  }


  const changeType = (value) => {
    const typeID = value !== '' ? value : null
    if (typeID && typeID !== '') {
      setLoading(true)
      //setTypeId(typeID)
      let oldResultWasFound = false
      if (data){
        for (let i=0; i<data.length; i++){
          const result = data[i]
          if (result.type && typeID == result.type._id){
            oldResultWasFound = true
            setForm({ ...form, type: value, update: null, before: result.points, id: result._id })
          }
        }
      }
      
      if (!oldResultWasFound){
        setForm({ ...form, type: value, update: null, before: 0 })
      }
      
    } else {
      setForm({ ...form, type: value, update: null, before: 0 })
    }
    setLoading(false)
  }



  const toggle = () => setModal(!modal)

  const modifyResultsIfNecessary = () => {
    if (userIndex !== undefined && resultModifier !== undefined) {
      resultModifier(userIndex, form.before, form.points)
    }
  }

  const saveChanges = () => {
    if (form.update) {
      updateStudentPoints()
      toggle()
    } else {
      addStudentPoints()
      toggle()
    }
  }

  const addStudentPoints = () => {
    setLoading(true)
      const post = {
        courseInstance: courseInstance._id,
        hasUser: user._id,
        awardedBy: getUser().fullURI,
        type: form.type === '' ? null : form.type,
        points: form.points,
        description: form.description,
        reference: form.reference,
      }
      newUserResult(post).unwrap().then(response => {
        setLoading(false)
        //modifyResultsIfNecessary()
        toggle()
      })
  }

  const updateStudentPoints = () => {
    const body = {
      points: form.points,
      description: form.description,
      reference: form.reference,
    }
    updateResult({
      id: form.id,
      body
    }).unwrap().then(response => {
      setLoading(false)
      //modifyResultsIfNecessary()
      toggle()
    })
  }

  /*
  const updatePartsForm = (part) => {
    const oldPart = partsForm[part.partNumber]
    let updatedPart = {
      partNumber: part.partNumber,
      points: oldPart && oldPart.points? oldPart.points : 0,
      description: oldPart && oldPart.description? oldPart.description : "",
    }
    if (part.points!=null){
      updatedPart.points = part.points
    }
    if (part.description!=null){
      updatedPart.description = part.description
    }
    let newPartsForm = [...partsForm]
    newPartsForm[part.partNumber] = updatedPart
    setPartsForm(newPartsForm)
  }
*/

  //const resultPartsRender = []
  //const resultParts = []
  const options = []
  options.push(
    <option value="" key="empty-select">
      Without result type
    </option>
  )

  if (props.resultTypes && props.resultTypes[0]!=undefined) {

    for (let i = 0; i < props.resultTypes[0].hasResultType.length; i++) {

      options.push(
        <option
          value={props.resultTypes[0].hasResultType[i]._id}
          key={props.resultTypes[0].hasResultType[i]._id}
        >
          {props.resultTypes[0].hasResultType[i].name}
        </option>
      )

      /*
      if (form.type && props.resultTypes[0].hasResultType[i]._id == form.type){
        const resultType = props.resultTypes[0].hasResultType[i]
        
        if (resultType.numberOfParts != null && resultType.numberOfParts > 0){
          for (let part=0; part < resultType.numberOfParts; part++){
            resultParts.push("")
            resultPartsRender.push(
              <FormGroup>
                <p className='bold'>{"Part "+(part+1)}</p>

              <Label for={"part"+(part+1)+"points"}>How many points?</Label>
              <Input
                type="text"
                name={"part"+(part+1)+"points"}
                id={"part"+(part+1)+"points"}
                placeholder="e.g. 12"
                value={partsForm[part] && partsForm[part].points ? partsForm[part].points : 0}
                onChange={e => {
                  updatePartsForm({partNumber: part, points: e.target.value})
                }}
              />
              <Label for={"part"+(part+1)+"description"}>Description</Label>
              <Input
                type="textarea"
                name={"part"+(part+1)+"description"}
                id={"part"+(part+1)+"description"}
                value={partsForm[part] && partsForm[part].description? partsForm[part].description : ""}
                onChange={e => {
                  updatePartsForm({partNumber: part, description: e.target.value})
                }}
              />
            </FormGroup>
            )
          }
        }
      }
      */
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
                onChange={e => {
                  const value = e.target.value
                  changeType(value)
                }}
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