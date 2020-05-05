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

class NavigationCourseClass extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false,
      courseId: props.courseId,
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  componentDidMount() {
    // const { match: { params } } = this.props;
    //
    // this.setState({
    //     courseId: params.id,
    // })
  }

  render() {
    const current = this.props.navReducer.current.sub
    const { privileges } = this.props

    let courseID = this.props.history.location.pathname.substring(8)
    if (courseID.indexOf('/') !== -1) {
      courseID = courseID.substring(0, courseID.indexOf('/'))
    }
    const ASSIGNMENTS = '/courses/' + courseID + '/assignments'

    return (
      <Navbar className="sub-nav" expand="md">
        <div className="navbar-left">
          <UncontrolledDropdown className="dropdown-course">
            <DropdownToggle tag="a" className="nav-toggle">
              <NavbarBrand>
                {this.props.abbr}{' '}
                <img src={RightArrow} alt="right" className="arrow-right" />
              </NavbarBrand>
            </DropdownToggle>
            <DropdownMenu className="teacher-dropdown">
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
        </div>

        <NavbarToggler onClick={this.toggle}>
          <img src={Bars} alr="bars" style={{ width: '30px' }} />
        </NavbarToggler>

        <Collapse isOpen={this.state.isOpen} navbar>
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
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={ROUTES.RESULTS}
                className="nav-link nav-button"
              >
                Results
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={{ pathname: '' }}
                onClick={() => this.props.history.push(ASSIGNMENTS)}
                className="nav-link nav-button"
              >
                Assignments
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                activeClassName="is-active"
                to={ROUTES.DOCUMENTS}
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
      </Navbar>
    )
  }
}

const mapStateToProps = ({ navReducer, privilegesReducer }) => {
  return {
    navReducer,
    privileges: privilegesReducer,
  }
}

const NavigationCourse = connect(mapStateToProps)(NavigationCourseClass)

export { NavigationCourse }
