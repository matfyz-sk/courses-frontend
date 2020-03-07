import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink } from 'reactstrap';
import './Navigation.css';
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
                <NavbarBrand href="/"><img src={logo} alt="logo" width="70" height="40"/></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <AuthUserContext.Consumer>
                        {() => this.props.isSignedIn ? (
                            <NavigationAuth isAdmin={this.props.isAdmin}/>
                        ) : (
                            <NavigationNonAuth/>
                        )}
                    </AuthUserContext.Consumer>
                </Collapse>
            </Navbar>
        )
    };
}

const NavigationAuth = ({ isAdmin }) => (
    <Nav>
        <NavItem>
            <Link to={ROUTES.COURSES} className="nav-link nav-button">Courses</Link>
        </NavItem>

        {isAdmin && (
            <NavItem>
                <Link to={ROUTES.NEW_COURSE} className="nav-link nav-button">New Course</Link>
            </NavItem>
        )}
        <NavItem className="navbar-right">
            <NavLink className="profile">
                <img src={profilePicture} alt="profile"  width="40" height="40"/>
            </NavLink>
        </NavItem>
    </Nav>
);

const NavigationNonAuth = () => (
    <Nav>
        <NavItem>
            <Link to={ROUTES.COURSES} className="nav-link nav-button">Courses</Link>
        </NavItem>
        <div className="navbar-right">
            <NavItem>
                <Link to={ROUTES.SIGN_UP} className="nav-link nav-button">Sign Up</Link>
            </NavItem>
            <NavItem>
                <Link to={ROUTES.SIGN_IN} className="nav-link nav-button">Sign In</Link>
            </NavItem>
        </div>
    </Nav>
);

const NavigationCourse = ({ isAdmin, course }) => {
    class InnerNavigation extends React.Component {
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
                    <NavbarBrand href="/courses">Abbrev</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav>
                            {course &&
                            <NavItem>
                                <Link to={ROUTES.TIMELINE + course.cid} className="nav-link nav-button">Timeline</Link>
                            </NavItem>
                            }
                            <NavItem>
                                <NavLink>
                                    <span className="fake-nav">Topics</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <span className="fake-nav">Results</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <Link to={ROUTES.ASSIGNMENTS} className="nav-link nav-button">Assignments</Link>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <span className="fake-nav">Documents</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <span className="fake-nav">Quiz</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <span className="fake-nav">Info</span>
                                </NavLink>
                            </NavItem>
                            <NavItem className="navbar-right">
                                <NavLink className="profile">
                                    <img src={profilePicture} alt="profile"  width="40" height="40"/>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            )
        }
    }

    return <InnerNavigation/>;
};

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Navigation);

export { NavigationCourse };