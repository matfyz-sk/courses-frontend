import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import React from 'react'

export const QuizzesMigrationForm = ({ navigation }) => {
  const { previous, next } = navigation
  return (
    <Form className="course-migration-container">
      <FormGroup check>
        <Label for="quizMigrationCheckbox">
          <Input
            name="quizMigrationCheckbox"
            id="quizMigrationCheckbox"
            type="checkbox"
            checked
            disabled
          />{' '}
          I don't want to migrate any quizzes right now. (I might not have a
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
