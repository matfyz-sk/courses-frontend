import React, {Component} from 'react';
import {CourseContext, withAuthorization} from '../Session';
import {Link} from "react-router-dom";
import {Enroll} from "../Enrollments";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import classnames from 'classnames';
import './Courses.css';
import Navigation from "../Navigation";

class CoursesPage extends Component {
    constructor(props) {
        super(props);
        this.enroll = this.enroll.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            loading: false,
            courses: [],
            myCourses: [],
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
        this.setState({ loading: true });
        let courseInstances = [];
        let courses = [];
        let combined = [];

        this.props.firebase.courseInstances()
            .get()
            .then(snapshot => {

                snapshot.forEach(doc =>
                    courseInstances.push({ ...doc.data(), cid: doc.id }),
                );

                this.props.firebase.courses()
                    .get()
                    .then(snapshot => {

                        snapshot.forEach(doc => {
                            courses.push({...doc.data(), cid: doc.id});
                        });

                        courseInstances.forEach(courseInstance => {
                            let course = courses.find(course => (courseInstance.instanceOf === course.cid));
                            combined.push({...courseInstance, ...course, cid: courseInstance.cid});
                        });

                        this.setState({
                            courses: combined,
                            loading: false,
                        });
                    })
                    .then(
                        this.props.firebase.enrollments()
                            .where("user", "==", this.props.authUser.uid)
                            .get()
                            .then(snapshot => {
                                let enrollments = [];

                                snapshot.forEach(doc => {
                                    enrollments.push({...doc.data()});
                                });
                                let myCourses = [];
                                this.state.courses.forEach(course => {enrollments.forEach(enrollment => {
                                    if (course.cid === enrollment.courseInstance) {
                                        myCourses.push(course);
                                    }
                                })});

                                let otherCourses = this.state.courses.filter(x => !myCourses.map(x => x.cid).includes(x.cid));

                                this.setState({
                                    myCourses: myCourses,
                                    otherCourses: otherCourses,
                                });
                            })
                        )
                    })
    }

    enroll(course) {
        if (Enroll(this.props.authUser.uid, course.cid, this.props.firebase)){
            this.props.history.push({
                pathname: '/timeline/'+ course.cid
            });
        }
    }

    render() {
        const {courses, myCourses, otherCourses, loading} = this.state;

        return (
            <div>
                <Navigation />
                <main className="courses_main">
                <div className="courses">

                    <h1>Welcome to Courses</h1>

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
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <CoursesList courses={myCourses} fun={()=>true}  button={false} enroll={this.enroll}/>
                        </TabPane>
                        <TabPane tabId="2">
                            <CoursesList courses={otherCourses} fun={activeCourses} button={true} enroll={this.enroll}/>
                        </TabPane>
                        <TabPane tabId="3">
                            <CoursesList courses={courses} fun={archivedCourses} button={false} enroll={this.enroll}/>
                        </TabPane>
                    </TabContent>
                </div>
                </main>
            </div>
        );
    }

}

function activeCourses(year) {
    return year === 2019;
}

function archivedCourses(year) {
    return year < 2019;
}

const CoursesList = ({ courses, fun, button, enroll }) => (
    <CourseContext.Consumer>
    {({course, setCourse}) => (
        <ListGroup>
        {courses.filter(courses => (fun(courses.year))).map(course => (
            <ListGroupItem key={course.cid} onClick={() => setCourse(course)}>
                <Link to={'/timeline/'+course.cid}>
                    <span className="name">{course.name}</span>
                    <br></br>
                    <span className="about">{course.about}</span>
                    {button && <button className="enroll-button" onClick={() => {
                        enroll(course)
                    }}>Enroll</button>}
                </Link>
            </ListGroupItem>
        ))}
        </ListGroup>
        )}
    </CourseContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CoursesPage);
