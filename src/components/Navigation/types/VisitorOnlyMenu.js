import React from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

const VisitorOnlyMenu = props => (
  <>
    <NavItem>
      <Link to="/login" className={`clickable nav-link ${ props.current === 'login' ? 'active' : ""}`}>Login</Link>
    </NavItem>
    <NavItem>
      <Link to="/register" className={`clickable nav-link ${ props.current === 'register' ? 'active' : ""}`}>Register</Link>
    </NavItem>
  </>
);

export default VisitorOnlyMenu;
