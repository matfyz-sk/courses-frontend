import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationCourse } from '../components/Navigation'
// eslint-disable-next-line import/no-cycle
import { store } from '../index'
import { setMainNav } from '../redux/actions/navigationActions'
// eslint-disable-next-line import/no-cycle
import { fetchCourseInstance } from '../redux/actions'
import {getUserInCourseType} from "../components/Auth";

class CourseLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course_id: this.props.match.params.course_id ?? null,
      course: null,
    }
  }

  componentDidMount() {
    store.dispatch(setMainNav('courses'))
    // eslint-disable-next-line react/destructuring-assignment
    const { course_id } = this.state
    if (course_id) {
      this.setState({ course_id })
      this.props.fetchCourseInstance(course_id)
    } else {
      // redirect wrong id
    }
  }

  render() {
    const { course } = this.props
    const { course_id } = this.state
    const userInCourseType = getUserInCourseType(course_id);
    return (
      <>
        <NavigationCourse
          abbr={course ? course.instanceOf[0].abbreviation : '...'}
          courseId={course_id}
          userInCourseType={userInCourseType}
        />
        {this.props.children}
      </>
    )
  }
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  return {
    course: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, { fetchCourseInstance })(CourseLayout)
)
