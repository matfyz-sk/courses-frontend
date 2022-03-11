import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationCourse } from '../components/Navigation/NavigationCourse'
// eslint-disable-next-line import/no-cycle
import { store } from '../index'
import { setMainNav } from '../redux/actions/navigationActions'
// eslint-disable-next-line import/no-cycle
import { fetchCourseInstance, setCourseInstancePrivileges } from '../redux/actions'
import { idFromURL } from "../functions/global";

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
    const {course_id} = this.state
    if(course_id) {
      this.setState({course_id})
      const {course} = this.props
      if(!course || idFromURL(course['@id']) !== course_id) {
        store.dispatch(setCourseInstancePrivileges({course_id}))
        this.props.fetchCourseInstance(this.props.history, course_id)
      }
    }
  }

  componentWillUnmount() {
    //store.dispatch(clearCourseInstance())
  }

  render() {
    const {course, privileges} = this.props
    const {course_id} = this.state
    return (
      <>
        <NavigationCourse
          history={ this.props.history }
          match={ this.props.match }
          abbr={
            course && course.instanceOf
              ? course.instanceOf[0].abbreviation
              : '...'
          }
          courseId={ course_id }
        />
        { this.props.children }
      </>
    )
  }
}

const mapStateToProps = ({courseInstanceReducer, privilegesReducer}) => {
  return {
    course: courseInstanceReducer.courseInstance,
    privileges: privilegesReducer.inCourseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, {fetchCourseInstance})(CourseLayout)
)
