import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {Row, Col, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle} from 'reactstrap';

export default class MainPage extends Component {
    render() {
        const render_students = [];
        for (let i = 0; i < 100; i++) {
            render_students.push(
                <Col xs={6} sm={3} className={"mb-4"}>
                    <Card>
                        <CardImg top width="100%" src="https://loremflickr.com/320/240/student" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Name Surname</CardTitle>
                            <CardSubtitle>Student</CardSubtitle>
                            <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                            <Link to={'/detail'}>Detail</Link>
                        </CardBody>
                    </Card>
                </Col>
            )
        }


        return (
            <React.Fragment>
                <h1>Wellcome</h1>
                <Row className={"mt-5"}>
                    {render_students}
                </Row>
            </React.Fragment>
        )
    }
}