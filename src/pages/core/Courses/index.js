import React, {Component} from 'react';
import {CourseContext, withAuthorization} from '../../../components/Session';
import {Link} from "react-router-dom";

import {
    Card,
    CardBody,
    ListGroup,
    ListGroupItem,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    UncontrolledCollapse
} from 'reactstrap';

import './Courses.css';
import Navigation from "../../../components/Navigation";
import EnrollModal from "../EnrollModal"
import AddInstructorModal from "../AddInstructorModal"
import {Courses} from "./courses-data.js";

import student_icon from "../../../images/student.svg";
import teacher_icon from "../../../images/teacher.svg";
import admin_icon from "../../../images/admin.svg";
import arrow from "../../../images/arrow.svg";

import classnames from 'classnames';
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";
import {compose} from "recompose";
// import {Enroll} from "../Enrollments";

const THIS_YEAR = 2019;

class CoursesPageBase extends Component {
    constructor(props) {
        super(props);
        this.enroll = this.enroll.bind(this);
        this.toggle = this.toggle.bind(this);
        this.groupCourses = this.groupCourses.bind(this);

        this.state = {
            activeTab: '1',
            loading: false,
            allCourses: Courses,
            activeCourses: [],//ActiveCourses, //not (enrolled || teaching || admin) && this semester
            myActiveCourses: [],//MyActiveCourses, //  (enrolled || teaching || admin) && this semester
            myArchivedCourses: [],//MyArchivedCourses, // (enrolled || teaching || admin) && not this semester
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    groupCourses(courses) {
        let groupedCourses = {};
        for(let i in courses) {
            let course = courses[i];
            if (!(course.course_id in groupedCourses)) {
                groupedCourses[course.course_id] = {
                    id: course.course_id,
                    name: course.name,
                    desc: course.description,
                    abbr: course.abbreviation,
                    admin: course.admin,
                    courses: [],
                };
            }
            groupedCourses[course.course_id].courses.push(
                {
                    id: course.id,
                    year: course.year,
                    enrolled: course.enrolled,
                    instructor: course.instructor,
                }
            )
        }
        return Object.keys(groupedCourses).map(function (key) {
            return groupedCourses[key];
        });
    }

    componentDidMount() {
        this.setState({ loading:true });

        let activeCourses = [];
        let myActiveCourses = [];
        let myArchivedCourses = [];

        for(let i in this.state.allCourses) {
            let course = this.state.allCourses[i];
            if (course.enrolled === true || course.instructor === true || course.admin === true) {
                if (course.year === THIS_YEAR) {
                    myActiveCourses.push(course);
                }
                else if(course.year < THIS_YEAR) {
                    myArchivedCourses.push(course);
                }
            }
            else {
                if (course.year === THIS_YEAR) {
                    activeCourses.push(course);
                }
            }
        }

        activeCourses = this.groupCourses(activeCourses);
        myActiveCourses = this.groupCourses(myActiveCourses);
        myArchivedCourses = this.groupCourses(myArchivedCourses);
        let allCourses = this.groupCourses(this.state.allCourses);

        this.setState({
            activeCourses: activeCourses,
            myActiveCourses: myActiveCourses,
            myArchivedCourses: myArchivedCourses,
            allCourses: allCourses,
            loading: false
        })
    }

    enroll(course) {}

    render() {
        const {myActiveCourses, myArchivedCourses, activeCourses, allCourses, loading} = this.state;

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
                            <CoursesList coursesList={myActiveCourses} enroll={null} isAdmin={this.props.isAdmin}/>
                        </TabPane>
                        <TabPane tabId="2">
                            <CoursesList coursesList={activeCourses} enroll={this.enroll} isAdmin={this.props.isAdmin}/>
                        </TabPane>
                        <TabPane tabId="3">
                            <CoursesList coursesList={myArchivedCourses} enroll={null} isAdmin={this.props.isAdmin}/>
                        </TabPane>
                        {this.props.isAdmin &&
                            <TabPane tabId="4">
                                <CoursesList coursesList={allCourses} enroll={null} isAdmin={this.props.isAdmin}/>
                            </TabPane>
                        }
                    </TabContent>
                </div>
                </main>
            </div>
        );
    }
}

const CoursesList = ({ coursesList, enroll, isAdmin }) => (
    <CourseContext.Consumer>
    { (setCourse) => (
        <ListGroup>
        {coursesList.map(course => (
            <ListGroupItem className="course-container" key={course.id}>
                {course.courses && course.courses.length === 1 &&
                    <div>
                        <Link to={'/timeline/' + course.courses[0].id}>
                            <span className="name">{course.name}</span>
                            <br/>
                            <span className="about">{course.desc}</span>
                        </Link>
                        {(isAdmin || course.admin) && <AddInstructorModal courseName={course.name}/>}
                        <div className="role_icon">
                            {course.admin !== false &&
                                <img src={admin_icon} alt="admin" width="20px" height="20px"/>}
                            <RoleIcon course={course.courses[0]}/>
                        </div>
                        {enroll != null && <EnrollModal course={course}/>}
                    </div>
                }
                {course.courses && course.courses.length > 1 &&
                    <div>
                        <div className="role_icon">
                            {course.admin !== false &&
                                <img src={admin_icon} alt="admin" width="20px" height="20px"/>}
                        </div>
                        <span className="name">{course.name}</span>
                        <br/>
                        <span className="about">{course.desc}</span>
                        <br/>
                        <CollapsableCourse course={course} enroll={enroll} isAdmin={isAdmin}/>
                    </div>
                }
            </ListGroupItem>
            ))}
        </ListGroup>
        )}
    </CourseContext.Consumer>
);

const CollapsableCourse = ({course, enroll, isAdmin}) => (
    <div>
        <img src={arrow} alt="arrow" className="collapse-arrow" id={'toggler'+course.id} width="15px"/>
        <UncontrolledCollapse toggler={'#toggler'+course.id}>
            <Card className="course-instances-card">
                <CardBody className="course-instances-card-body">
                    {course.courses.sort((a, b) => (a.year > b.year) ? 1 : -1).map(courseInstance => (
                        <ListGroup key={courseInstance.id}>
                            <ListGroupItem>
                                <Link to={'/timeline/' + courseInstance.id}>
                                    <span className="">{course.name}</span> <b>{courseInstance.year}</b>
                                </Link>
                                {(isAdmin || course.admin) && <AddInstructorModal courseName={course.name}/>}
                                <div className="role_icon"><RoleIcon course={courseInstance}/></div>
                                {enroll != null && <EnrollModal course={courseInstance}/>}
                            </ListGroupItem>
                        </ListGroup>
                    ))}
                </CardBody>
            </Card>
        </UncontrolledCollapse>
    </div>
);

const RoleIcon = ({course}) => (
    <div>
        {course.enrolled !== false && <img src={student_icon} alt="student" width="20px" height="20px"/>}
        {course.instructor !== false && <img src={teacher_icon} alt="teacher" width="20px" height="20px"/>}
    </div>
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

