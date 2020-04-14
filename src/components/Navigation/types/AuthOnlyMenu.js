import React from 'react';
import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

const AuthOnlyMenu = props => (
  <>
    <NavItem>
      <Link to="/dashboard" className={`clickable nav-link ${ props.current === 'dashboard' ? 'active' : ""}`}>
        Dashboard
      </Link>
    </NavItem>
  </>
);

export default AuthOnlyMenu;
