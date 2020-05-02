import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import React from 'react'

export const AssignmentsMigrationForm = ({ navigation }) => {
  const { previous, next } = navigation

  return (
    <Form className="course-migration-container">
      <FormGroup check>
        <Label for="assignmentsMigrationCheckbox">
          <Input
            name="assignmentsMigrationCheckbox"
            id="assignmentsMigrationCheckbox"
            type="checkbox"
            checked
            disabled
          />{' '}
          I don't want to migrate any assignments right now. (I might not have a
          choice.)
        </Label>
      </FormGroup>
      <div className="button-container-migrations">
        <Button className="new-event-button" onClick={previous}>
          Previous
        </Button>
        <Button className="new-event-button" onClick={next}>
          Next
        </Button>
      </div>
    </Form>
  )
}
