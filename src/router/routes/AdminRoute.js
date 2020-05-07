import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { getUser } from '../../components/Auth'
import { BASE_URL, COURSE_URL } from '../../pages/core/constants'
import { axiosRequest, getData } from '../../pages/core/AxiosRequests'
import { getShortId } from '../../pages/core/Helper'
import {connect} from "react-redux";

class AdminRoute extends React.Component {
  state = {
    haveAccess: false,
    loaded: false,
  }

  componentDidMount() {
    this.haveAccess()
  }

  haveAccess = () => {
    const {
      computedMatch: { params },
    } = this.props

    const user = getUser()
    if (user) {
      if (user.isSuperAdmin) {
        this.setState({
          haveAccess: true,
          loaded: true,
        })
      } else {
        const url = `${BASE_URL + COURSE_URL}/${params.course_id}`
        axiosRequest('get', null, url).then(response => {
          const data = getData(response)
          if (data != null && data !== []) {
            const course = data.map(courseData => {
              return {
                admins: Array.isArray(courseData.hasAdmin)
                  ? courseData.hasAdmin.map(admin =>
                    getShortId(admin['@id'])
                  )
                  : [getShortId(courseData.hasAdmin['@id'])],
              }
            })[0]

            if (course.admins.includes(user.id)) {
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
    if (prevProps.token !== this.props.token) {
      this.haveAccess()
    }
  }

  render() {
    const { component: Component, ...rest } = this.props
    const { loaded, haveAccess } = this.state
    if (!loaded) return null
    return (
      <Route
        {...rest}
        render={props => {
          return haveAccess ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }}
      />
    )
  }
}

const mapStateToProps = ({ authReducer }) => {
  return {
    token: authReducer._token,
  }
}

export default withRouter(connect(mapStateToProps)(AdminRoute))
