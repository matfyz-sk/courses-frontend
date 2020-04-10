import React from 'react'
import { CourseContext } from './context'

const withCourse = Component => {
  class WithCourse extends React.Component {
    constructor(props) {
      super(props)

      this.setCourse = course => {
        this.setState({
          course,
        })
      }

      this.state = {
        course: null,
        setCourse: this.setCourse,
      }
    }

    render() {
      const course = this.state
      return (
        <CourseContext.Provider value={course}>
          <Component {...this.props} />
        </CourseContext.Provider>
      )
    }
  }
  return WithCourse
}

export default withCourse
