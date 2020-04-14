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
import RightArrow from './assets/next.svg';
import {redirect} from "../../constants/redirect";

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
      const current = this.props.navReducer.current.sub;


        return (
            <Navbar className="sub-nav" expand="md">
                <div className="navbar-left">
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
                        <NavbarBrand href="/courses">{this.props.name} <img src={RightArrow} alt='right' className="arrow-right" /></NavbarBrand>
                    }
                </div>

                <NavbarToggler onClick={this.toggle}/>

                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav>
                      <NavItem>
                        <NavLink activeClassName='is-active'
                                 to={
                                   redirect(ROUTES.DASHBOARD, [
                                     {key: 'course_id', value: this.state.courseId}, {key: 'timeline_id', value: 1}
                                   ])
                                 }
                                 className={`nav-link nav-button ${  current === 'dashboard' ? 'active' : ''}`}>Dashboard</NavLink>
                      </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active'
                                     to={
                                       redirect(ROUTES.TIMELINE_ID, [
                                         {key: 'course_id', value: this.state.courseId}, {key: 'timeline_id', value: 1}
                                       ])
                                     }
                                     className={`nav-link nav-button ${  current === 'timeline' ? 'active' : ''}`}>Timeline</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.RESULTS} className={`nav-link nav-button ${  current === 'results' ? 'active' : ''}`}>
                                Results
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.ASSIGNMENTS} className={`nav-link nav-button ${  current === 'assignments' ? 'active' : ''}`}>Assignments</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.DOCUMENTS} className="nav-link nav-button">
                                Documents
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={
                              redirect(ROUTES.QUIZ, [{key: 'course_id', value: this.state.courseId}])
                            } className={`nav-link nav-button ${  current === 'quiz' ? 'active' : ''}`}>
                                Quiz
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='is-active' to={ROUTES.INFO}  className="nav-link nav-button">
                                Info
                            </NavLink>
                        </NavItem>
                      <NavItem>
                        <NavLink activeClassName='is-active' to={ROUTES.INFO}  className="nav-link nav-button">
                          Settings
                        </NavLink>
                      </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = ( { userReducer, navReducer } ) => {
    return {
      navReducer,
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

const NavigationCourse = connect(mapStateToProps, { setUserAdmin })(NavigationCourseClass)

export { NavigationCourse };
