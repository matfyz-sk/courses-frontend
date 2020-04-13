import React from 'react';
import { NavLink } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
        UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavigationCourse } from "./NavigationCourse";

import './assets/Navigation.scss';
import {connect} from "react-redux";
import {setUserAdmin} from "../../redux/actions";
import logo from '../../images/hat.svg';
import profilePicture from '../../images/profile.jpg';


class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Navbar className="navbar" expand="md">
                {/*<NavbarToggler onClick={this.toggle} />*/}
                {/*<Collapse isOpen={this.state.isOpen} navbar>*/}
                    <AuthUserContext.Consumer>
                        {() => this.props.isSignedIn ? (
                            <NavigationAuth isAdmin={this.props.isAdmin} setUserAdmin={this.props.setUserAdmin}/>
                        ) : (
                            <NavigationNonAuth/>
                        )}
                    </AuthUserContext.Consumer>
                {/*</Collapse>*/}
            </Navbar>
        )
    };
}

const NavigationAuth = ({ isAdmin, setUserAdmin }) => (
    <Nav>
        <div className="navbar-left">
            <NavbarBrand href="/"><img src={logo} alt="logo" width="70" height="40"/></NavbarBrand>
            <NavItem>
                <NavLink activeClassName='is-active' to={ROUTES.COURSES} className="nav-link nav-button">Courses</NavLink>
            </NavItem>
            {isAdmin && (
                <NavItem>
                    <NavLink activeClassName='is-active' to={ROUTES.NEW_COURSE} className="nav-link nav-button">New Course</NavLink>
                </NavItem>
            )}
        </div>
        <ProfileTab isAdmin={isAdmin} setUserAdmin={setUserAdmin}/>
    </Nav>
);

const ProfileTab = ({isAdmin, setUserAdmin}) => (
    <NavItem className="navbar-profile">
        <NavLink to="" className="profile">
            <img src={profilePicture} alt="profile"  width="40" height="40"/>
        </NavLink>
        <UncontrolledDropdown>
            <DropdownToggle tag="a" className="nav-link student-admin-button" caret>
                {isAdmin ? ("ADMIN") : ("STUDENT")}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={() => setUserAdmin(!isAdmin)}>
                    {isAdmin ? ("STUDENT") : ("ADMIN")}
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    </NavItem>
);

const NavigationNonAuth = () => (
    <Nav>
        <div  className="navbar-left">
            <NavbarBrand href="/"><img src={logo} alt="logo" width="70" height="40"/></NavbarBrand>
            <NavItem>
                <NavLink to={ROUTES.COURSES} className="nav-link nav-button">Courses</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to={ROUTES.SIGN_UP} className="nav-link nav-button">Sign Up</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to={ROUTES.SIGN_IN} className="nav-link nav-button">Sign In</NavLink>
            </NavItem>
        </div>
    </Nav>
);

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Navigation);

export {NavigationCourse, ProfileTab};
