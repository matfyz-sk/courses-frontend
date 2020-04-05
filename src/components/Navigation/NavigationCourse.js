import React  from "react";
import {Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar,
    NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown} from "reactstrap";
import {ProfileTab} from "./index";
import {NavLink} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import profilePicture from "../../images/profile.jpg";
import {setUserAdmin} from "../../redux/actions";
import {connect} from "react-redux";
import logo from "../../images/hat.svg";

class NavigationCourseClass extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            courseId: '2',
        };

    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        // const { match: { params } } = this.props;
        //
        // this.setState({
        //     courseId: params.id,
        // })
    }

    render() {
        return (
            <Navbar className="navbar" expand="md">
                <div className="navbar-left">
                    <NavbarBrand className="nav-logo" href="/"><img src={logo} alt="logo" width="70" height="40"/></NavbarBrand>
                    {this.props.isAdmin ?
                        <UncontrolledDropdown className="dropdown-course">
                            <DropdownToggle tag="a" className="nav-link nav-toggle" >
                                <div className="nav-course nav-button navbar-brand" href="/courses">{this.props.courseAbbr}</div>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='nav-button'>
                                    <NavLink to={ROUTES.USER_MANAGEMENT + this.state.courseId} className="nav-link nav-button">User Management</NavLink>
                                </DropdownItem>
                                <DropdownItem className='nav-button'>
                                    <NavLink to={ROUTES.COURSE_MIGRATION + this.state.courseId} className="nav-link nav-button">Course Migration</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        :
                        <NavbarBrand className="nav-course" href="/courses">{this.props.courseAbbr}</NavbarBrand>
                    }
                </div>

                <NavbarToggler onClick={this.toggle}/>

                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.TIMELINE + this.state.courseId} className="nav-link nav-button">Timeline</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.RESULTS}  className="nav-link nav-button">
                                Results
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.ASSIGNMENTS} className="nav-link nav-button">Assignments</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.DOCUMENTS} className="nav-link nav-button">
                                Documents
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.QUIZ}  className="nav-link nav-button">
                                Quiz
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.INFO}  className="nav-link nav-button">
                                Info
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>

                <ProfileTab isAdmin={this.props.isAdmin} setUserAdmin={this.props.setUserAdmin}/>
            </Navbar>
        )
    }
}

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

const NavigationCourse = connect(mapStateToProps, { setUserAdmin })(NavigationCourseClass)

export  { NavigationCourse };