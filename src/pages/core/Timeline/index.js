import {Component} from "react";
import React from "react";
import EventsList, {BlockMenu} from "../Events"
import {Container, Row, Col, Button} from 'reactstrap';
import { NavigationCourse } from "../../../components/Navigation";
import NextCalendar from "../NextCalendar";
import './Timeline.css'
// import withAuthorization from "../../../components/Session/withAuthorization";

import {Events} from "./timeline-data";
import {Courses} from "../Courses/courses-data";

import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";
import {Link} from "react-router-dom";

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            courseInstance: undefined,
            eventsSorted: [],
            timelineBlocks: [], //for timeline purposes even Session can be a block
            nestedEvents: [],
        };

        this.getTimelineBlocks = this.getTimelineBlocks.bind(this);
        this.getNestedEvents = this.getNestedEvents.bind(this);
        this.greaterEqual = this.greaterEqual.bind(this);
        this.greater = this.greater.bind(this);
        this.sortEventsFunction = this.sortEventsFunction.bind(this);
        this.getDisplayDateTime = this.getDisplayDateTime.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;

        let courses = Courses;
        let courseInstance;

        for(let i in courses) {
            let course = courses[i];
            if (course.id === params) {
                courseInstance = course;
            }
        }

        // TODO get all events where courseInstance.id = params
        let events = Events;

        events.sort(this.sortEventsFunction);
        console.log('events', events);

        let timelineBlocks = this.getTimelineBlocks(events);
        let nestedEvents = this.getNestedEvents(events, timelineBlocks);

        console.log('nestedEvents', nestedEvents);

        this.setState({
            courseInstance: courseInstance,
            eventsSorted: events,
            timelineBlocks: timelineBlocks,
            nestedEvents: nestedEvents,
        });
    }

    sortEventsFunction(e1,e2) {
        if (new Date(e1.startDate) > new Date(e2.startDate)) {
            return 1;
        } else if (new Date(e1.startDate) < new Date(e2.startDate)) {
            return -1;
        }

        if (e1.type > e2.type) {
            return 1;
        } else if (e1.type < e2.type) {
            return -1
        } else {
            return 0;
        }
    }

    getTimelineBlocks(events) {
        let timelineBlocks = [];
        timelineBlocks.push(events[0]);
        for(let i = 1; i < events.length; i++) {
            let event = events[i];
            let block = timelineBlocks[timelineBlocks.length-1];
            if (event.type === "block" || new Date(event.startDate) >= new Date(block.endDate)) {
                timelineBlocks.push(event);
            }
        }
        return timelineBlocks;
    }

    getNestedEvents(events, timelineBlocks) {
        for(let block of timelineBlocks){
            if (block.type === 'Block') {
                block.sessions = [];
                block.tasks = [];
            }
            for(let event of events) {
                if (block.id !== event.id && event.type !== 'Block') {
                    if ((event.type === 'Lecture' || event.type === 'Lab') &&
                        ((this.greaterEqual(event.startDate, block.startDate) &&
                            !this.greaterEqual(event.startDate, block.startDate)) ||
                            (this.greater(event.endDate, block.startDate) &&
                            !this.greater(event.endDate, block.endDate)))) {
                        event.displayDateTime = this.getDisplayDateTime(event.startDate);
                        block.sessions.push(event);
                    }
                    else if (((event.type === 'OralExam' || event.type === "TestTake") &&
                            (this.greaterEqual(event.startDate, block.startDate) &&
                            !this.greaterEqual(event.startDate, block.endDate))) ||
                        (event.type === 'Task' && (this.greater(event.endDate, block.startDate) &&
                            !this.greater(event.endDate, block.endDate)))) {
                        if (event.type === 'OralExam' || event.type === "TestTake") {
                            event.displayDateTime = this.getDisplayDateTime(event.startDate);
                        }
                        else if (event.type === 'Task') {
                            event.displayDateTime = this.getDisplayDateTime(event.endDate);
                        }
                        block.tasks.push(event);
                    }
                }
            }
        }
        return timelineBlocks;
    }

    getDisplayDateTime(dateTime) {
        let dateTimeISOFormat = new Date(dateTime);
        let day = dateTimeISOFormat.getDay();
        let dayFormated = (day < 10 ? '0' + day : day);
        let month = (dateTimeISOFormat.getMonth()+1);
        let monthFormated = (month < 10 ? '0' + month : month);
        let hours = dateTimeISOFormat.getHours();
        let hoursFormated = (hours < 10 ? '0' + hours : hours);
        let minutes = dateTimeISOFormat.getMinutes();
        let minutesFormated = (minutes < 10 ? '0' + minutes : minutes);
        let date = dayFormated + '.' + monthFormated + '.';
        let time = hoursFormated + ':' + minutesFormated;
        return date + ' ' + time;
    }

    greaterEqual(dateTime1, dateTime2) {
        return new Date(dateTime1) >= new Date(dateTime2);
    }
    greater(dateTime1, dateTime2) {
        return new Date(dateTime1) > new Date(dateTime2)
    }

    render() {
        const {timelineBlocks, nestedEvents} = this.state;
        return (
            <div>
                <NavigationCourse isAdmin={this.props.isAdmin} course={this.state.courseInstance} setUserAdmin={this.props.setUserAdmin}/>
                    {this.state.eventsSorted.length===0 ? <p>Timeline for this course is empty.</p> :
                    <Container className='timeline-container'>
                        <Row className="timeline-row">
                            <Col xs="3" className="timeline-left-col">
                                <BlockMenu courseEvents={timelineBlocks}/>
                                {this.props.isAdmin && //|| myId===courseInstance.hasInstructor &&
                                <Link to={'/createtimeline/' + 1}> {/*TODO add proper id*/}
                                    <Button className='new-event-button'>New Event</Button>
                                </Link>}
                                <NextCalendar/>
                            </Col>
                            <Col className="event-list-col">
                                <EventsList courseEvents={nestedEvents} isAdmin={this.props.isAdmin}/>
                            </Col>
                        </Row>
                    </Container>
                    }
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
