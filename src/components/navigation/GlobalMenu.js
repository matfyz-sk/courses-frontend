import React from 'react';
import { Link } from "react-router-dom";
import {
    NavItem,
} from 'reactstrap';

const GlobalMenu = (props) => (
    <React.Fragment>
        <NavItem>
            <Link to="/courses" className="clickable nav-link">Courses</Link>
        </NavItem>
    </React.Fragment>
);

export default GlobalMenu;