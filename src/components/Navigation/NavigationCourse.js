import React from "react";
import {
    Collapse, DropdownItem, DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from "reactstrap";
import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import profilePicture from "../../images/profile.jpg";
import {setUserAdmin} from "../../redux/actions";
import {connect} from "react-redux";
import logo from "../../images/hat.svg";

class NavigationCoursee extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
    }

    render() {
        return (
            <Navbar className="navbar" expand="md">
                <div>
                <NavbarBrand className="nav-logo" href="/"><img src={logo} alt="logo" width="70" height="40"/></NavbarBrand>
                <NavbarBrand className="nav-course" href="/courses">{this.props.courseAbbr}</NavbarBrand>
                </div>
                <NavbarToggler onClick={this.toggle}/>

                {/*{this.props.isAdmin &&*/}
                {/*<NavItem>*/}
                {/*    <Link to={ROUTES.USER_MANAGEMENT + courseAbbr} className="nav-link nav-button">User Management</Link>*/}
                {/*</NavItem>*/}
                {/*}*/}
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav>
                        <NavItem>
                            <Link to={ROUTES.TIMELINE + this.props.courseAbbr} className="nav-link nav-button">Timeline</Link>
                        </NavItem>
                        {/*<NavItem>*/}
                        {/*    <NavLink>*/}
                        {/*        <span className="fake-nav">Topics</span>*/}
                        {/*    </NavLink>*/}
                        {/*</NavItem>*/}
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
                    </Nav>
                </Collapse>

                <NavItem className="navbar-profile">
                    <NavLink className="profile">
                        <img src={profilePicture} alt="profile"  width="40" height="40"/>
                    </NavLink>
                    <UncontrolledDropdown setActiveFromChild>
                        <DropdownToggle tag="a" className="nav-link" caret>
                            {this.props.isAdmin ? ("ADMIN") : ("STUDENT")}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem active onClick={() => this.props.setUserAdmin(!this.props.isAdmin)}>
                                {this.props.isAdmin ? ("STUDENT") : ("ADMIN")}
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
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

const NavigationCourse = connect(mapStateToProps, { setUserAdmin })(NavigationCoursee)

export  { NavigationCourse };