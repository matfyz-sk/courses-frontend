import React from 'react'
import { NavLink} from 'react-router-dom'
import { NavItem } from 'reactstrap'

const GlobalMenu = props => (
  <>
    <NavItem>
      <NavLink
        to="/courses"
        activeClassName="is-active"
        className={`clickable nav-link ${
          props.current === 'courses' ? 'active' : ''
        }`}
      >
        Courses
      </NavLink>
    </NavItem>
  </>
)

export default GlobalMenu
