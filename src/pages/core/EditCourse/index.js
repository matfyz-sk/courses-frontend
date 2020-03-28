import React from 'react';
import Navigation from "../../../components/Navigation";
import CourseForm from "../CourseForm";
import {compose} from "recompose";
import {connect} from "react-redux";
// import {withAuthorization} from "../../../components/Session";
import {Container, Card, CardHeader, CardBody} from 'reactstrap';

const COURSE = {
    name: 'Some Course',
    description: '...here is Some Course\'s description',
    abbreviation: 'SCourse',
    prerequisites: [],
    admin: [{ surname: 'Novy', name: 'Jozo' }],
};

class EditCourse extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                name: COURSE.name,
                description: COURSE.description,
                abbreviation: COURSE.abbreviation,
                prerequisites: COURSE.prerequisites,
                admin: COURSE.admin,
            };
        }

        componentDidMount() {
            // const { match: { params } } = this.props; TODO get Course ID

            //TODO get Course with ID

            this.setState({
                // name: COURSE.name,
                // description: COURSE.description,
                // abbreviation: COURSE.abbreviation,
                // prerequisites: COURSE.prerequisites,
                // admin: COURSE.admin,
            });
        }

        render() {
            return (
            <div>
                <Navigation />
                <Container className="event-card-header">
                    <Card>
                        <CardHeader>Edit Course</CardHeader>
                        <CardBody>
                            <CourseForm typeOfForm='Edit' {...this.state}/>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default compose(
    connect(mapStateToProps, {}),
    // withAuthorization(condition)
)(EditCourse);