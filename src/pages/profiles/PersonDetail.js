import React, { Component } from 'react';
import { Col, Row, Button, ListGroup, ListGroupItem  } from 'reactstrap';

export default class PersonDetail extends Component {
    render() {
        const render_badges = [];
        for(let i = 0; i < 20; i++) {
            render_badges.push(
                <Col sm={2} xs={4} className={"mb-3"}>
                    <img src={"https://loremflickr.com/320/240/badge"} className={"w-100"} />
                </Col>
            )
        }


        return (
            <React.Fragment>
                <Row className={"mt-5"}>
                    <Col sm={6} xs={12}>
                        <img src={"https://loremflickr.com/320/240/student"} alt={"name surname"} />
                        <h1>Name Surname</h1>
                        <h2>Student</h2>
                    </Col>
                    <Col sm={6} xs={12}>
                        <h2>About me</h2>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </Col>
                </Row>
                <Row className={"mt-5 mb-5"}>
                    <Col sm={6} xs={12}>
                        <h2 className={"mb-3"}>Badges</h2>
                        <Row>{render_badges}</Row>
                    </Col>
                    <Col sm={6} xs={12}>
                        <h2 className={"mb-3"}>You can meet me on courses</h2>
                        <ListGroup>
                            <ListGroupItem>Cras justo odio</ListGroupItem>
                            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                            <ListGroupItem>Morbi leo risus</ListGroupItem>
                            <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                            <ListGroupItem>Vestibulum at eros</ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}