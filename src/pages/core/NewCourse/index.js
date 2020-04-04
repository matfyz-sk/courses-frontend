import React from 'react';
import Navigation from "../../../components/Navigation";
import CourseForm from "../CourseForm";
import {compose} from "recompose";
import {connect} from "react-redux";
// import {withAuthorization} from "../../../components/Session";
import {Container, Card, CardHeader, CardBody} from 'reactstrap';
import './NewCourse.css';

const NewCourse = () => (
    <div>
        <Navigation />
        <Container>
            <Card>
                <CardHeader className="event-card-header">New Course</CardHeader>
                <CardBody>
                    <CourseForm typeOfForm='Create'/>
                </CardBody>
            </Card>
        </Container>
    </div>
);

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default compose(
    connect(mapStateToProps, {}),
    // withAuthorization(condition)
)(NewCourse);