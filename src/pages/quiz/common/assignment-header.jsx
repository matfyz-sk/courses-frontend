import React from 'react'
import { Label, FormGroup, Input } from 'reactstrap'
import DatePicker from 'react-datepicker'

const AssignmentHeader = ({
  startDate,
  endDate,
  description,
  onStartDateChange,
  onEndDateChange,
  handleChange,
}) => {
  return (
    <>
      <FormGroup>
        <Label for="startDate">Start date</Label>
        <br />
        <DatePicker
          id="startDate"
          name="startDate"
          dateFormat="dd/MM/yyyy"
          selected={startDate}
          onChange={onStartDateChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="endDate">End date</Label>
        <br />
        <DatePicker
          id="endDate"
          name="endDate"
          dateFormat="dd/MM/yyyy"
          selected={endDate}
          onChange={onEndDateChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input
          type="textarea"
          name="description"
          id="description"
          value={description}
          onChange={handleChange}
        />
      </FormGroup>
    </>
  )
}

export default AssignmentHeader
