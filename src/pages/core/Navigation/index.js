import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink } from 'reactstrap';
import './Navigation.css';


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
                <NavbarBrand href="/">Matfyz</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <AuthUserContext.Consumer>
                        {authUser => authUser ? (
                            <NavigationAuth authUser={authUser}/>
                        ) : (
                            <NavigationNonAuth/>
                        )}
                    </AuthUserContext.Consumer>
                </Collapse>
            </Navbar>
        )
    };
}

const NavigationAuth = ({ authUser }) => (
    <Nav>
        <NavItem>
            <Link to={ROUTES.COURSES} className="nav-link nav-button">Courses</Link>
        </NavItem>
        {authUser.roles.includes(ROLES.ADMIN) && (
            <NavItem>
                <Link to={ROUTES.ADMIN} className="nav-link nav-button">Admin</Link>
            </NavItem>
        )}
        <NavItem>
            <Link to={ROUTES.ACCOUNT} className="nav-link nav-button">Account</Link>
        </NavItem>
        <NavItem>
            <NavLink>
                <SignOutButton />
            </NavLink>
        </NavItem>
    </Nav>
);

const NavigationNonAuth = () => (
    <Nav>
        <NavItem>
            <Link to={ROUTES.LANDING}  className="nav-link nav-button">Landing</Link>
        </NavItem>
        <NavItem>
            <Link to={ROUTES.SIGN_IN} className="nav-link nav-button">Sign In</Link>
        </NavItem>
    </Nav>
);

const NavigationCourse = ({ authUser, course }) => {
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
                    <NavbarBrand href="/courses">Matfyz</NavbarBrand>
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
                                <NavLink>
                                    <span className="fake-nav">Assignments</span>
                                </NavLink>
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
                            <NavItem>
                                <NavLink>
                                    <SignOutButton/>
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

export default Navigation;

export { NavigationCourse };