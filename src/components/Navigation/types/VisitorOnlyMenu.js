import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NavItem } from 'reactstrap'

const VisitorOnlyMenu = props => (
  <>
    <NavItem>
      <NavLink
        to="/login"
        activeClassName="is-active"
        className={`clickable nav-link ${
          props.current === 'login' ? 'active' : ''
        }`}
      >
        Login
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        to="/register"
        activeClassName="is-active"
        className={`clickable nav-link ${
          props.current === 'register' ? 'active' : ''
        }`}
      >
        Register
      </NavLink>
    </NavItem>
  </>
)

export default VisitorOnlyMenu
