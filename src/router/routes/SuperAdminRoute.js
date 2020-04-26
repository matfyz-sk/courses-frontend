import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { getUser } from '../../components/Auth'

function SuperAdminRoute({ component: Component, ...rest }) {
  const user = getUser()

  return (
    <Route
      {...rest}
      render={props =>
        user && user.isSuperAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}

export default withRouter(SuperAdminRoute)
