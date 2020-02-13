import React from 'react';
import { Link } from "react-router-dom";
import {
    NavItem,
} from 'reactstrap';

const AuthOnlyMenu = (props) => (
    <React.Fragment>
        <NavItem>
            <Link className="clickable nav-link" to={'/info'}>Info</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/lectures'}>Lectures</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/labs'}>Labs</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/assignments'}>Assignments</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/results'}>Results</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/quiz'}>Quiz</Link>
        </NavItem>
        <NavItem>
            <Link className="clickable nav-link" to={'/files'}>Files</Link>
        </NavItem>
    </React.Fragment>
);

export default AuthOnlyMenu;