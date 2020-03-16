import withAuthorization from "../../../components/Session/withAuthorization";

import {Component} from "react";
import React from "react";
import EventsList, {BlockMenu} from "../Events"
import { Container, Row, Col } from 'reactstrap';
import {NavigationCourse} from "../../../components/Navigation";
import ModalCreateEvent from "../ModalCreateEvent";
import './Timeline.css';
import {Events} from "./timeline-data";
import {Courses} from "../Courses/courses-data";
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: [],
            courseInstance: undefined,
            course: "",
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;

        console.log("params", params);

        let courses = Courses;
        let events = Events;

        for(let i in courses) {
            let course = courses[i];
            if (course.id === params) {
                this.setState({courseInstance: course});
            }
        }
    }

    render() {
        return (
            <div>
                <NavigationCourse isAdmin={this.props.isAdmin} course={this.state.courseInstance} setUserAdmin={this.props.setUserAdmin}/>
                {/*<main>*/}
                {/*    {this.state.events.length===0 && !this.state.loading &&*/}
                {/*    <p>Timeline for this course is empty.</p>*/}
                {/*    }*/}
                {/*    {this.state.events.length>0 &&*/}
                {/*    <Container>*/}
                {/*        <Row>*/}
                {/*            <Col xs="auto">*/}
                {/*                <BlockMenu courseEvents={this.state.events}/>*/}
                {/*                {this.state.courseInstance && this.props.authUser.uid===this.state.courseInstance.hasInstructor &&*/}
                {/*                <ModalCreateEvent/>*/}
                {/*                }*/}
                {/*            </Col>*/}
                {/*            <Col>*/}
                {/*                <EventsList courseEvents={this.state.events}/>*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    </Container>*/}
                {/*    }*/}
                {/*</main>*/}
            </div>
        );
    }
}

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Timeline);

// const condition = authUser => !!authUser;

// export default withAuthorization(condition)(Timeline);
