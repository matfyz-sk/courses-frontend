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
import { setCourseInstance } from '../redux/actions'

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
      this.fetchCourses(course_id)
    }
  }

  fetchCourses(course_id) {
    const header = authHeader()
    fetch(`${BASE_URL}${COURSE_INSTANCE_URL}/${course_id}`, {
      method: 'GET',
      headers: header,
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data['@graph'].length > 0) {
          const course = data['@graph'][0]
          this.setState({ course }, () => {
            store.dispatch(setCourseInstance(course))
          })
        }
      })
  }

  render() {
    return (
      <>
        <NavigationCourse
          name={this.state.course ? this.state.course.name : '...'}
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

export default withRouter(connect(mapStateToProps)(CourseLayout))
