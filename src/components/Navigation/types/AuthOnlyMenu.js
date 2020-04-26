import React from 'react'
import { Link } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import { NEW_COURSE } from '../../../constants/routes'

const AuthOnlyMenu = props => {
  const { current, user } = props

  return (
    <>
      <NavItem>
        <Link
          to="/dashboard"
          className={`clickable nav-link ${
            current === 'dashboard' ? 'active' : ''
          }`}
        >
          Dashboard
        </Link>
      </NavItem>
      {user && user.isSuperAdmin && (
        <NavItem>
          <Link
            to={NEW_COURSE}
            className='clickable nav-link'
          >
            New Course
          </Link>
        </NavItem>
      )}
    </>
  )
}

export default AuthOnlyMenu
