import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import CoursesIcon from "../assets/hat.svg";

const GlobalMenu = props => (
  <>
    <NavItem>
      <NavLink
        to="/courses"
        activeClassName="is-active"
        className={ `clickable nav-link ${
          props.current === 'courses' ? 'active' : ''
        }` }
      >
        <div className="d-md-none d-sm-inline-block h-100">
          <img
            src={ CoursesIcon }
            alt="courses-icon"
            className="h-100"
          />
        </div>
        <div className="d-none d-md-inline-block">Courses</div>
      </NavLink>
    </NavItem>
  </>
)

export default GlobalMenu
