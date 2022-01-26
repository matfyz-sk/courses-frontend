import React from 'react'
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import * as ROUTES from '../../constants/routes'
import RightArrow from './assets/next.svg'
import Bars from './assets/bars.png'
import { redirect } from '../../constants/redirect'
import Settings from './assets/settings.svg'
import { getInstructorRights } from '../../pages/core/Helper'

class NavigationCourseClass extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: [false, false],
      courseId: props.courseId,
      isAdmin: false,
    }
  }

  toggle(teacherNav = true) {
    const { isOpen } = this.state
    if (teacherNav) {
      isOpen[1] = !isOpen[1]
      isOpen[0] = false
    } else {
      isOpen[0] = !isOpen[0]
      isOpen[1] = false
    }
    this.setState({
      isOpen,
    })
  }

  componentDidMount() {
    const { user, courseInstance } = this.props
    if (courseInstance && user && getInstructorRights(user, courseInstance)) {
      this.setState({
        isAdmin: true,
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { user, courseInstance } = this.props
    if (
      prevProps.user !== user ||
      prevProps.courseInstance !== courseInstance
    ) {
      if (courseInstance && user && getInstructorRights(user, courseInstance)) {
        this.setState({
          isAdmin: true,
        })
      }
    }
  }

  render() {
    const current = this.props.navReducer.current.sub
    const { privileges, teacherNav, courseInstance, user } = this.props
    const { isAdmin } = this.state
    let courseID = this.props.history.location.pathname.substring(8)
    if (courseID.indexOf('/') !== -1) {
      courseID = courseID.substring(0, courseID.indexOf('/'))
    }
    const ASSIGNMENTS = `/courses/${courseID}/assignments`

    // const teacherMenu = []
    // for (let i = 0; i < teacherNav.menu.length; i++) {
    //   teacherMenu.push(
    //     <NavItem key={`mobile-nav ${teacherNav.menu[i].key}`}>
    //       <NavLink
    //         activeClassName="is-active"
    //         to={teacherNav.menu[i].href}
    //         className={`nav-link nav-button ${
    //           teacherNav.current === teacherNav.menu[i].key ? 'is-active' : ''
    //         }`}
    //       >
    //         {teacherNav.menu[i].name}
    //       </NavLink>
    //     </NavItem>
    //   )
    // }

    return (
      <Navbar className="sub-nav" expand="md">
        <div className="navbar-left">
          <NavbarBrand>
            {this.props.abbr}{' '}
            <img src={RightArrow} alt="right" className="arrow-right" />
          </NavbarBrand>
        </div>

        {/*{teacherNav.menu.length > 0 ? (*/}
        {/*  <NavbarToggler onClick={() => this.toggle(true)} className="ml-auto">*/}
        {/*    <img src={Settings} alr="settings" style={{ width: '20px' }} />*/}
        {/*  </NavbarToggler>*/}
        {/*) : null}*/}
        {/*<div class="navbar-container">*/}

        <NavbarToggler
          onClick={() => this.toggle(false)}
          className={isAdmin ? "bars-toggler" : ""}
        >
          <img src={Bars} alr="bars" style={{ width: '30px' }} />
        </NavbarToggler>

        <Collapse isOpen={this.state.isOpen[0]} navbar>
          <Nav>
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={redirect(ROUTES.TIMELINE, [
                  { key: 'course_id', value: this.state.courseId },
                  // { key: 'timeline_id', value: 1 },
                ])}
                className={`nav-link nav-button ${
                  current === 'timeline' ? 'active' : ''
                }`}
              >
                Timeline
              </NavLink>
            </NavItem>
            {privileges.inCourseInstance !== 'visitor' ? (
              <NavItem>
                {privileges.inCourseInstance === 'student' ? (
                  <NavLink
                    to={redirect(ROUTES.MY_RESULTS, [
                      { key: 'course_id', value: this.state.courseId },
                    ])}
                    activeClassName="is-active"
                    className="nav-link nav-button"
                  >
                    My results
                  </NavLink>
                ) : (
                  <NavLink
                    to={redirect(ROUTES.RESULTS, [
                      { key: 'course_id', value: this.state.courseId },
                    ])}
                    activeClassName="is-active"
                    className="nav-link nav-button"
                  >
                    Results
                  </NavLink>
                )}
              </NavItem>
            ) : null}
            <NavItem>
              <NavLink
                to={redirect(ROUTES.ASSIGNMENTS, [
                  { key: 'course_id', value: this.state.courseId },
                ])}
                className="nav-link nav-button"
              >
                Assignments
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={redirect(ROUTES.DOCUMENTS, [
                  { key: 'course_id', value: this.state.courseId },
                ])}
                className="nav-link nav-button"
              >
                Documents
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={redirect(ROUTES.QUIZ, [
                  { key: 'course_id', value: this.state.courseId },
                ])}
                className="nav-link nav-button"
              >
                Quiz
              </NavLink>
            </NavItem>
            {/*<NavItem>*/}
            {/*  <NavLink*/}
            {/*    activeClassName="is-active"*/}
            {/*    to={ROUTES.INFO}*/}
            {/*    className="nav-link nav-button"*/}
            {/*  >*/}
            {/*    Info*/}
            {/*  </NavLink>*/}
            {/*</NavItem>*/}
            {privileges.inCourseInstance !== 'visitor' ? (
              <NavItem>
                <NavLink
                  activeClassName="is-active"
                  to={redirect(ROUTES.COURSE_TEAMS, [
                    { key: 'course_id', value: this.state.courseId },
                  ])}
                  className="nav-link nav-button"
                >
                  Teams
                </NavLink>
              </NavItem>
            ) : null}
          </Nav>
        </Collapse>
        {isAdmin && (
          <UncontrolledDropdown className="dropdown-course">
            <DropdownToggle tag="a" className="settings">
              <img src={Settings} alr="settings" className="setting-img mr-2" />
            </DropdownToggle>
            <DropdownMenu right className="teacher-dropdown">
              <DropdownItem className="nav-button">
                <NavLink
                  to={redirect(ROUTES.USER_MANAGEMENT, [
                    { key: 'course_id', value: this.state.courseId },
                  ])}
                  className="nav-link nav-button"
                >
                  User Management
                </NavLink>
              </DropdownItem>
              <DropdownItem className="nav-button">
                <NavLink
                  to={redirect(ROUTES.COURSE_MIGRATION, [
                    { key: 'course_id', value: this.state.courseId },
                  ])}
                  className="nav-link nav-button"
                >
                  Course Migration
                </NavLink>
              </DropdownItem>
              <DropdownItem className="nav-button">
                <NavLink
                  to={redirect(ROUTES.CREATE_TIMELINE, [
                    { key: 'course_id', value: this.state.courseId },
                  ])}
                  className="nav-link nav-button"
                >
                  Edit Timeline
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
        {/*<div className="d-md-none d-sm-block w-100">*/}
        {/*  <Collapse isOpen={this.state.isOpen[1]} navbar>*/}
        {/*    <Nav>*/}
        {/*      {teacherMenu}*/}
        {/*    </Nav>*/}
        {/*  </Collapse>*/}
        {/*</div>*/}
        {/*</div>*/}
      </Navbar>
    )
  }
}

const mapStateToProps = ({
  navReducer,
  privilegesReducer,
  teacherNavReducer,
  courseInstanceReducer,
  authReducer,
}) => {
  return {
    navReducer,
    privileges: privilegesReducer,
    teacherNav: teacherNavReducer,
    courseInstance: courseInstanceReducer.courseInstance,
    user: authReducer.user,
  }
}

const NavigationCourse = connect(mapStateToProps)(NavigationCourseClass)

export { NavigationCourse }
