import { Button, CardSubtitle, Form, FormGroup, Input, Label } from 'reactstrap'
import React from 'react'

export const AssignmentsMigrationForm = ({navigation}) => {
  const {previous, next} = navigation

  return (
    <>
      <CardSubtitle className="card-subtitle-migrations">Assignments Migration</CardSubtitle>
      <Form className="course-migration-container">
        <FormGroup check>
          <Label for="assignmentsMigrationCheckbox">
            <Input
              name="assignmentsMigrationCheckbox"
              id="assignmentsMigrationCheckbox"
              type="checkbox"
              checked
              disabled
            />{ ' ' }
            I don't want to migrate any assignments right now.
          </Label>
        </FormGroup>
        <div className="button-container-migrations">
          <Button className="new-event-button" onClick={ previous }>
            Previous
          </Button>
          <Button className="new-event-button" onClick={ next }>
            Next
          </Button>
        </div>
      </Form>
    </>
  )
}
