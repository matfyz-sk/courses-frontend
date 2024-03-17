import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import { NEW_COURSE, TOPICS } from '../../../constants/routes'
import DashboardIcon from '../assets/dashboard.svg'
import { MdImportContacts } from "react-icons/md";

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
              style={{ padding: 3 }}
            />
          </div>
          <div className="d-none d-md-inline-block">Dashboard</div>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
            to={TOPICS}
            activeClassName="is-active"
            className={`clickable nav-link ${
                props.current === 'topics' ? 'active' : ''
            }`}
        >
          <div className="d-md-none d-sm-inline-block h-100">
            <MdImportContacts size={24} />
          </div>
          <div className="d-none d-md-inline-block">Topics</div>
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
