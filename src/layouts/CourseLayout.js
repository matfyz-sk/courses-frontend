import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationCourse } from '../components/Navigation/NavigationCourse'
// eslint-disable-next-line import/no-cycle
import { store } from '../index'
import { setMainNav } from '../redux/actions/navigationActions'
// eslint-disable-next-line import/no-cycle
import {
  fetchCourseInstance,
  setCourseInstancePrivileges,
  clearCourseInstance
} from '../redux/actions'
import {idFromURL} from "../functions/global";
import { useLazyGetCourseInstanceQuery } from 'services/course'
import { getFullID } from 'helperFunctions'

function CourseLayout(props) {
  const course_id = props.match.params.course_id ?? null
  const { course, privileges } = props
  const [getCourseInstace] = useLazyGetCourseInstanceQuery()

  useEffect(() =>{
    if (course_id) {
      if (!course || idFromURL(course['_id']) !== course_id) {
        store.dispatch(setCourseInstancePrivileges({ course_id }))
        props.fetchCourseInstance(props.history, getFullID(course_id, "courseInstance"), getCourseInstace)
      }
    }
  },[])

  return (
    <>
      <NavigationCourse
        history = { props.history }
        match = { props.match }
        abbr={
          course && course.instanceOf
            ? course.instanceOf.abbreviation
            : '...'
        }
        courseId={course_id}
      />
      { props.children }
    </>
  )
}

const mapStateToProps = ({ courseInstanceReducer, privilegesReducer }) => {
  return {
    course: courseInstanceReducer.courseInstance,
    privileges: privilegesReducer.inCourseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, { fetchCourseInstance })(CourseLayout)
)
