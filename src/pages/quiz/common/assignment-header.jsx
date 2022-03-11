import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import DatePicker from 'react-datepicker'
import WarningMessage from './warning-message'

const AssignmentHeader = ({
                            startDate,
                            endDate,
                            description,
                            onStartDateChange,
                            onEndDateChange,
                            handleChange,
                            showWarning
                          }) => {
  return (
    <>
      <FormGroup>
        <FormGroup>
          <Label for="startDate">Start date</Label>
          <br/>
          <DatePicker
            id="startDate"
            name="startDate"
            dateFormat="dd/MM/yyyy"
            selected={ startDate }
            onChange={ onStartDateChange }
          />
        </FormGroup>
        <FormGroup>
          <Label for="endDate">End date</Label>
          <br/>
          <DatePicker
            id="endDate"
            name="endDate"
            dateFormat="dd/MM/yyyy"
            selected={ endDate }
            onChange={ onEndDateChange }
          />
        </FormGroup>
        { showWarning && <WarningMessage
          text={ showWarning.date }
        /> }
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input
          type="textarea"
          name="description"
          id="description"
          value={ description }
          onChange={ handleChange }
        />
        { showWarning && <WarningMessage
          text={ showWarning.description }
          className='mt-2'
        /> }
      </FormGroup>
    </>
  )
}

export default AssignmentHeader
