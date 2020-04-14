import React from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

const GlobalMenu = props => (
  <>
    <NavItem>
      <Link to="/courses" className={`clickable nav-link ${ props.current === 'courses' ? 'active' : ""}`}>
        Courses
      </Link>
    </NavItem>
  </>
);

export default GlobalMenu;
