import React, {Component} from 'react';
import {CourseContext, withAuthentication, withAuthorization, withCourse} from '../../../components/Session';
import {Link} from "react-router-dom";
// import {Enroll} from "../Enrollments";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import classnames from 'classnames';
import './Courses.css';
import Navigation from "../../../components/Navigation";
import {Courses} from "./courses-data.js";
import student_icon from "../../../images/student.svg";
import teacher_icon from "../../../images/teacher.svg";
import admin_icon from "../../../images/admin.svg";
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";
import {compose} from "recompose";

const THIS_YEAR = 2019;

class CoursesPageBase extends Component {
    constructor(props) {
        super(props);
        this.enroll = this.enroll.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            loading: false,
            courses: Courses,
            myCourses: [], //enrolled || teaching || admin
            otherCourses: [],
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {
        this.setState({ loading:true });

        let myCourses = [];
        let otherCourses = [];
        for (let i in this.state.courses) {
            let course = this.state.courses[i];
            if (course.enrolled === true || course.instructor === true || course.admin === true) {
                myCourses.push(course);
            }
            else {
                otherCourses.push(course);
            }
        }

        this.setState({
            myCourses: myCourses,
            otherCourses: otherCourses,
            loading: false
        })
    }

    enroll(course) {}

    render() {
        const {courses, myCourses, otherCourses, loading} = this.state;

        return (
            <div>
                <Navigation />
                <main className="courses_main">
                <div className="courses">

                    {loading && <div>Loading ...</div>}

                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                <span className="tab">My Courses</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                <span className="tab">Active Courses</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                <span className="tab">Archived Courses</span>
                            </NavLink>
                        </NavItem>
                        {this.props.isAdmin &&
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={() => { this.toggle('4'); }}
                            >
                                <span className="tab">ALL Courses</span>
                            </NavLink>
                        </NavItem>
                        }
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <CoursesList courses={myCourses} fun={year=>(year===THIS_YEAR)} enroll={null}/>
                        </TabPane>
                        <TabPane tabId="2">
                            <CoursesList courses={otherCourses} fun={year=>(year===THIS_YEAR)} enroll={this.enroll}/>
                        </TabPane>
                        <TabPane tabId="3">
                            <CoursesList courses={myCourses} fun={year=>(year<THIS_YEAR)} enroll={null}/>
                        </TabPane>
                        {this.props.isAdmin &&
                            <TabPane tabId="4">
                                <CoursesList courses={courses} fun={()=>true} enroll={null}/>
                            </TabPane>
                        }
                    </TabContent>
                </div>
                </main>
            </div>
        );
    }
}

const CoursesList = ({ courses, fun, enroll }) => (
    <CourseContext.Consumer>
    {(setCourse) => (
        <ListGroup>
        {courses.filter(courses => (fun(courses.year))).map(course => (
            <ListGroupItem key={course.id} onClick={() => setCourse(course)}>
                <Link to={'/timeline/'+course.id}>
                    <span className="name">{course.name}</span>
                    <br/>
                    <span className="about">{course.description}</span>
                    {course.enrolled !== false &&
                    <img className="role_icon" src={student_icon} alt="student" width="20px" height="20px"/>}
                    {course.instructor !== false &&
                    <img className="role_icon" src={teacher_icon} alt="teacher" width="20px" height="20px"/>}
                    {course.admin !== false &&
                    <img className="role_icon" src={admin_icon} alt="admin" width="20px" height="20px"/>}
                    {enroll != null &&
                    <button className="enroll-button" onClick={() => {enroll(course)}}>Enroll</button>}
                </Link>
            </ListGroupItem>
        ))}
        </ListGroup>
        )}
    </CourseContext.Consumer>
);

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};


const condition = () => true;

const CoursesPage = compose(
    connect(mapStateToProps, { setUserAdmin }),
    withAuthorization(condition),
)(CoursesPageBase);

export default CoursesPage;

