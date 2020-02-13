import React from 'react';
import { Link } from "react-router-dom";
import {
    NavItem,
} from 'reactstrap';

const NotLoggedOnly = (props) => (
    <React.Fragment>
        <NavItem>
            <Link to="/login" className="clickable nav-link">Login</Link>
        </NavItem>
        <NavItem>
            <Link to="/register" className="clickable nav-link">Register</Link>
        </NavItem>
    </React.Fragment>
);

export default NotLoggedOnly;