import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationCourse } from '../components/Navigation'
// eslint-disable-next-line import/no-cycle
import { store } from '../index'
import { setMainNav } from '../redux/actions/navigationActions'
// eslint-disable-next-line import/no-cycle
import { authHeader } from '../components/Auth'
import { BASE_URL, COURSE_INSTANCE_URL } from '../pages/core/constants'
import { fetchCourseInstance, setCourseInstance } from '../redux/actions'

class CourseLayout extends Component {
  constructor(props) {
    super(props)
    this.fetchCourses = this.fetchCourses.bind(this)
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
    return (
      <>
        <NavigationCourse
          abbr={
            this.state.course
              ? this.state.course.instanceOf[0].abbreviation
              : '...'
          }
          courseId={this.state.course_id}
        />
        {this.props.children}
      </>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(
  connect(mapStateToProps, { fetchCourseInstance })(CourseLayout)
)
