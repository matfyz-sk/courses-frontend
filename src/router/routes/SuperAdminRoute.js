import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { getUser } from '../../components/Auth'
import {connect} from "react-redux";

function SuperAdminRoute({ component: Component, ...rest }) {
  const user = getUser()

  return (
    <Route
      {...rest}
      render={props =>
        user && user.isSuperAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  )
}

const mapStateToProps = ({ authReducer }) => {
  return {
    token: authReducer._token,
  }
}

export default withRouter(connect(mapStateToProps)(SuperAdminRoute))
