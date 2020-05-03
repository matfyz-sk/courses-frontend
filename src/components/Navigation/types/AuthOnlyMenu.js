import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import { NEW_COURSE } from '../../../constants/routes'

const AuthOnlyMenu = props => {
  const { current, user } = props

  return (
    <>
      <NavItem>
        <NavLink
          to="/dashboard"
          activeClassName="is-active"
          className={`clickable nav-link ${
            current === 'dashboard' ? 'active' : ''
          }`}
        >
          Dashboard
        </NavLink>
      </NavItem>
      {user && user.isSuperAdmin && (
        <NavItem>
          <NavLink
            to={NEW_COURSE}
            activeClassName="is-active"
            className='clickable nav-link'
          >
            New Course
          </NavLink>
        </NavItem>
      )}
    </>
  )
}

export default AuthOnlyMenu
