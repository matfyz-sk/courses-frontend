import React from 'react'
import { Redirect, Route, withRouter } from 'react-router-dom'
import { getUser } from '../../components/Auth'
import { BASE_URL, COURSE_INSTANCE_URL } from '../../pages/core/constants'
import { axiosRequest, getData } from '../../pages/core/AxiosRequests'
import { getShortId } from '../../pages/core/Helper'
import { connect } from 'react-redux'

class InstructorRoute extends React.Component {
  state = {
    haveAccess: false,
    loaded: false,
  }

  componentDidMount() {
    this.haveAccess()
  }

  haveAccess = () => {
    const {
      computedMatch: {params},
    } = this.props

    const user = getUser()
    if(user) {
      if(user.isSuperAdmin) {
        this.setState({
          haveAccess: true,
          loaded: true,
        })
      } else {
        const url = `${ BASE_URL + COURSE_INSTANCE_URL }/${
          params.course_id
        }?_join=instanceOf`

        axiosRequest('get', null, url).then(response => {
          const data = getData(response)
          if(data != null && data !== []) {
            const course = data.map(courseData => {
              return {
                instructors: courseData.hasInstructor
                  ? courseData.hasInstructor.map(instructor =>
                    getShortId(instructor['@id'])
                  )
                  : [],
                admins: Array.isArray(courseData.instanceOf[0].hasAdmin)
                  ? courseData.instanceOf[0].hasAdmin.map(admin =>
                    getShortId(admin)
                  )
                  : courseData.instanceOf[0].hasAdmin
                    ? [ getShortId(courseData.instanceOf[0].hasAdmin) ]
                    : [],
              }
            })[0]
            if(
              course.admins.includes(user.id) ||
              course.instructors.includes(user.id)
            ) {
              this.setState({
                haveAccess: true,
                loaded: true,
              })
            } else {
              this.setState({
                haveAccess: false,
                loaded: true,
              })
            }
          } else {
            this.setState({
              haveAccess: false,
              loaded: true,
            })
          }
        })
      }
    } else {
      this.setState({
        haveAccess: false,
        loaded: true,
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.token !== this.props.token) {
      this.haveAccess()
    }
  }

  render() {
    const {component: Component, layout: Layout, ...rest} = this.props
    const {loaded, haveAccess} = this.state
    if(!loaded) return null
    return (
      <Route
        { ...rest }
        render={ props => {
          return haveAccess ? (
            <Layout { ...props }>
              <Component { ...props } />
            </Layout>
          ) : (
            <Redirect to="/"/>
          )
        } }
      />
    )
  }
}

const mapStateToProps = ({authReducer}) => {
  return {
    token: authReducer._token,
  }
}

export default withRouter(connect(mapStateToProps)(InstructorRoute))
