import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import { NEW_COURSE } from '../../../constants/routes'
import DashboardIcon from '../assets/dashboard.svg'

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
          <div className="d-md-none d-sm-inline-block h-100">
            <img
              src={DashboardIcon}
              alt="dashboard-icon"
              className="h-100"
            />
          </div>
          <div className="d-none d-md-inline-block">Dashboard</div>
        </NavLink>
      </NavItem>
      {/*{user && user.isSuperAdmin && (*/}
      {/*  <NavItem>*/}
      {/*    <NavLink*/}
      {/*      to={NEW_COURSE}*/}
      {/*      activeClassName="is-active"*/}
      {/*      className='clickable nav-link'*/}
      {/*    >*/}
      {/*      New Course*/}
      {/*    </NavLink>*/}
      {/*  </NavItem>*/}
      {/*)}*/}
    </>
  )
}

export default AuthOnlyMenu
