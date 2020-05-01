import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap'
import './CourseMigration.css'
import { INITIAL_COURSE_STATE } from '../constants'
import { connect } from 'react-redux'
import CourseMigrationForm from '../CourseMigrationForm'
import EventsMigrationForm from '../EventsMigrationForm'

class CourseMigration extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: INITIAL_COURSE_STATE,
      redirectTo: null,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props
  }

  render() {
    const { courseInstance } = this.props
    return (
      <>
        <Container>
          <Card>
            <CardHeader className="event-card-header">
              Course Migration
              {courseInstance && <> - {courseInstance.instanceOf[0].name}</>}
            </CardHeader>
            <CardBody className="course-migration-card">
              <CourseMigrationForm />
              {/*{...courseInstance} />*/}
              <EventsMigrationForm courseInstance={courseInstance} />
              <AssignmentsMigrationForm />
              <QuizMigrationForm />
            </CardBody>
          </Card>
        </Container>
      </>
    )
  }
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(CourseMigration)

const AssignmentsMigrationForm = () => (
  <Form>
    <FormGroup check>
      <Label for="assignmentsMigrationCheckbox">
        <Input
          name="assignmentsMigrationCheckbox"
          id="assignmentsMigrationCheckbox"
          type="checkbox"
        />{' '}
        I don't want to migrate assignments.
      </Label>
    </FormGroup>
    <div className="button-container">
      <Button
        className="new-event-button"
        type="submit"
      >
        Next
      </Button>
    </div>
  </Form>
)

const QuizMigrationForm = () => (
  <Form>
    <FormGroup check>
      <Label for="quizMigrationCheckbox">
        <Input
          name="quizMigrationCheckbox"
          id="quizMigrationCheckbox"
          type="checkbox"
        />{' '}
        I don't want to migrate quizes.
      </Label>
    </FormGroup>
    <div className="button-container">
      <Button
        className="new-event-button"
        type="submit"
      >
        Next
      </Button>
    </div>
  </Form>
)
