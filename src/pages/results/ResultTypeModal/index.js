import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { 
  useNewResultTypeMutation,
  useUpdateResultTypeMutation,
  useDeleteResultTypeMutation,
  useUpdateCourseInstanceMutation,
  useGetAllResultTypesQuery
} from "services/result"
import { Checkbox } from '@material-ui/core'


function ResultTypeModal(props) {
  const {resultType, courseInstance, data} = props
  const courseInstanceId = !courseInstance ? "" : courseInstance._id
  const [ modal, setModal ] = useState(false)
  const [ form, setForm ] = useState({
    name: resultType ? resultType.name : '',
    minPoints: resultType ? resultType.minPoints : 0,
    description: resultType ? resultType.description : '',
    correctionFor: resultType ? resultType.correctionFor : '',
    //numberOfParts: resultType ? resultType.numberOfParts : 0,
    //hasFixedParts: resultType && resultType.hasFixedParts!=null ? resultType.hasFixedParts : true,
    aggregationType: resultType && resultType.aggregationType!=null ? resultType.aggregationType : "",
    numberOfAggregatedResults: resultType && resultType.numberOfAggregatedResults!=null ? resultType.numberOfAggregatedResults : 0,
    //isPartOf: resultType ? resultType.isPartOf : '',
  })
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [newResultType, newResultTypeResult] = useNewResultTypeMutation()
  const [updateResultType, updateResultTypeResult] = useUpdateResultTypeMutation()
  const [deleteResultType, deleteResultTypeResult] = useDeleteResultTypeMutation()
  const toggle = () => setModal(!modal)

  const { data: resultTypesData, isSuccess: isResultTypesSuccess, error: resultTypesError } = useGetAllResultTypesQuery(courseInstanceId, {
    skip: !courseInstance,
  }) 

  if (!resultTypesData){
    return <></>
  }

  const validate = () => {
    if(form.name.length === 0) {
      setError('Name is required!')
      setLoading(false)
      return false
    }
    // eslint-disable-next-line no-restricted-globals
    if(isNaN(parseFloat(form.minPoints)) || parseFloat(form.minPoints) < 0) {
      setError('0 is minimal value for points')
      setLoading(false)
      return false
    }
    setLoading(false)
    return true
  }

  const addResultTypeToCourse = (id) => {
    const resultTypes = []
    for(let i = 0; i < resultTypesData[0].hasResultType.length; i++) {
      resultTypes.push(resultTypesData[0].hasResultType[i]['_id'])
    }
    resultTypes.push(id)
    updateCourseInstance({
      id: courseInstance['_id'],
      body: {hasResultType: resultTypes}
    }).unwrap().then(response => {
      console.log("RESPONSE: " + JSON.stringify(response))
        setLoading(false)
        setModal(false)
    }).catch(e => {
      setLoading(false)
      setError(
        'Error has occured during saving process. Please, try again.'
      )
    })
  }

  const submitCreate = () => {
    setLoading(true)
    if(validate()) {
      if(form.correctionFor === '') {
        delete form.correctionFor
      }
      newResultType(form).unwrap().then(response => {
        setLoading(false)
        addResultTypeToCourse(response[0]._id)
      }).catch(e => {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )})
    }
  }

  const submitUpdate = () => {
    setLoading(true)
    if(validate()) {
      updateResultType({
        id: resultType['_id'],
        body: form
      }).unwrap().then(response => {
        setLoading(false)
        setError(null)
        setModal(false)
      }).catch(e => {
        setLoading(false)
        setError(
            'Error has occured during saving process. Please, try again.'
          )
      })
    }
  }

  const submitDelete = () => {
    setLoading(true)
    deleteResultType(resultType['_id']).unwrap().then(response => {
      setLoading(false)
      setError(null)
      setModal(false)
    })
    .catch((e) => {
      setError(
        'Error has occured during removing process. Please, try again.'
      )
    })
  }

  const options = []
  //const isPartOfOptions = []
  options.push(
    <option value="" key="empty-select">
      Without correction
    </option>
  )
  /*
  isPartOfOptions.push(
    <option value="" key="empty-isPartOf-select">
      Not a part of another result type
    </option>
  )
  */
  if (data) {
    for(let i = 0; i < data[0].hasResultType.length; i++) {
      if(!resultType || resultType['_id'] !== data[0].hasResultType[i]['_id']) {
        options.push(
          <option
            value={ data[0].hasResultType[i]['_id'] }
            key={ data[0].hasResultType[i]['_id'] }
          >
            { data[0].hasResultType[i].name }
          </option>
        )
        /*
        isPartOfOptions.push(
          <option
            value={ data[0].hasResultType[i]['_id'] }
            key={ data[0].hasResultType[i]['_id'] }
          >
            { data[0].hasResultType[i].name }
          </option>
        )
        */
      }
    }
  }


  const aggregationOptions = []

  const aggregationTypes = ["SUM", "MAX", "AVG", "SUM OF N LATEST", "SUM OF N BEST"]

  
    for(let i = 0; i < aggregationTypes.length; i++) {
        aggregationOptions.push(
          <option
            value={ aggregationTypes[i] }
            key={ aggregationTypes[i] }
          >
            {aggregationTypes[i]=="SUM" ? "SUM OF ALL" : aggregationTypes[i].toUpperCase() }
          </option>
        )
      }
    
  


  return (
    <>
      <Button
        color={ resultType ? 'link' : 'primary' }
        size="sm"
        className={ resultType ? 'text-right' : 'float-right mt-1' }
        onClick={ () => toggle() }
      >
        { resultType ? 'Detail' : 'New result type' }
      </Button>
      <Modal isOpen={ modal } toggle={ toggle }>
        <ModalHeader toggle={ toggle }>
          { resultType
            ? `Change result type ${ resultType.name }?`
            : 'Add result type to course?' }
        </ModalHeader>
        <ModalBody>
          { error !== null ? <Alert color="danger">{ error }</Alert> : null }
          <Form>
            <FormGroup>
              <Label for="name">Name of result type *</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="e.g. Midterm"
                value={ form.name ? form.name : "" }
                onChange={ e => {
                  setForm({...form, name: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={ form.description ? form.description : "" }
                onChange={ e => {
                  setForm({...form, description: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="minPoints">Minimum points to pass</Label>
              <Input
                type="number"
                name="text"
                id="minPoints"
                value={ form.minPoints ? form.minPoints : ""}
                onChange={ e => {
                  setForm({...form, minPoints: e.target.value})
                } }
              />
            </FormGroup>

            {/*<FormGroup>
              <Label for="isPartOf">This type is a part of another type</Label>
              <Input
                type="select"
                name="isPartOf"
                id="isPartOf"
                value={ form.isPartOf ? form.isPartOf : "" }
                onChange={ e => {
                  setForm({...form, isPartOf: e.target.value})
                } }
              >
                { isPartOfOptions }
              </Input>
              </FormGroup>*/}

            <FormGroup>
              <Label for="aggregationType">Type of aggregation</Label>
              <Input
                type="select"
                name="aggregationType"
                id="aggregationType"
                value={form.aggregationType ? form.aggregationType : ""}
                onChange={ e => {
                  setForm({...form, aggregationType: e.target.value})
                } }
              >
                {aggregationOptions}
              </Input>
            </FormGroup>
{form.aggregationType && form.aggregationType=="SUM OF N BEST" || form.aggregationType=="SUM OF N LATEST"? 
            <FormGroup>
              <Label for="numberOfAggregatedResults">Number of aggregated results</Label>
              <Input
                type="number"
                name="numberOfAggregatedResults"
                id="numberOfAggregatedResults"
                value={ form.numberOfAggregatedResults ? form.numberOfAggregatedResults : 0}
                onChange={ e => {
                  setForm({...form, numberOfAggregatedResults: e.target.value})
                } }
              />
            </FormGroup>: ""}

{/*
            <FormGroup>
              <Label for="numberOfParts">Number of parts</Label>
              <Input
                type="number"
                name="numberOfParts"
                id="numberOfParts"
                value={ form.numberOfParts ? form.numberOfParts : 0 }
                onChange={ e => {
                  setForm({...form, numberOfParts: e.target.value})
                } }
              />
            </FormGroup>

            <FormGroup>
                <Input
                className="ml-1"
                 type = "checkbox"
                 name="hasFixedParts"
                 id="hasFixedParts"
                 checked = {form.hasFixedParts}
                 onChange={ e => {
                  setForm({...form, hasFixedParts: !form.hasFixedParts})
                 }}
                />
                <Label className="ml-4" for="hasFixedParts">Number of parts is fixed</Label>
            </FormGroup>
                */}
            <FormGroup>
              <Label for="correctionFor">Result type is correction for</Label>
              <Input
                type="select"
                name="correctionFor"
                id="correctionFor"
                value={ form.correctionFor ? form.correctionFor : "" }
                onChange={ e => {
                  setForm({...form, correctionFor: e.target.value})
                } }
              >
                { options }
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={ toggle }>
            Cancel
          </Button>
          { resultType ? (
            <Button color="danger" onClick={ submitDelete }>
              Remove
            </Button>
          ) : null }
          <Button
            color="primary"
            onClick={ resultType ? submitUpdate : submitCreate }
            disabled={ loading }
          >
            { resultType ? 'Update' : 'Create' } result type
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

const mapStateToProps = ({courseInstanceReducer}) => {
  const {courseInstance} = courseInstanceReducer
  return {
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(ResultTypeModal))
