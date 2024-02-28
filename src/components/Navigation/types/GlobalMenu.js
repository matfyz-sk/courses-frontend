import React from 'react'
import { NavLink} from 'react-router-dom'
import { NavItem } from 'reactstrap'
import CoursesIcon from "../assets/hat.svg";
import { MdImportContacts } from "react-icons/md"
import { Icon } from "@material-ui/core";

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
        <div className="d-md-none d-sm-inline-block h-100">
          <img
            src={CoursesIcon}
            alt="courses-icon"
            className="h-100"
          />
        </div>
        <div className="d-none d-md-inline-block">Courses</div>
      </NavLink>
    </NavItem>
    {/*<NavItem>*/}
    {/*  <NavLink*/}
    {/*      to="/topics"*/}
    {/*      activeClassName="is-active"*/}
    {/*      className={`clickable nav-link ${*/}
    {/*          props.current === 'courses' ? 'active' : ''*/}
    {/*      }`}*/}
    {/*  >*/}
    {/*    <div className="d-md-none d-sm-inline-block h-100">*/}
    {/*      <MdImportContacts size={24} />*/}
    {/*    </div>*/}
    {/*    <div className="d-none d-md-inline-block">Topics</div>*/}
    {/*  </NavLink>*/}
    {/*</NavItem>*/}
  </>
)

export default GlobalMenu
