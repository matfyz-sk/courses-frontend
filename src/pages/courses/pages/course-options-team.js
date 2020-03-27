import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesOptionsTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article_id: props.match.params.article,
            form: {
                min: 0,
                max: 0,
                date_from: null,
                date_to: null,
            }
        }
    }
    render() {
        const {article_id, form} = this.state;
        return (
            <div className={"content-padding"}>
                <Sidebar />

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses">Courses</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses/detail">Výpočtová logika</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Options</BreadcrumbItem>
                    <BreadcrumbItem active>Teams</BreadcrumbItem>
                </Breadcrumb>

                <h1>Team criteria of {article_id ? "article id " + article_id : 'course'}</h1>
                <Row>
                    <Col sm={6} xs={12} className={"mt-5"}>
                        <Form>
                            <FormGroup row>
                                <Label for="min" sm={3}>Min users</Label>
                                <Col sm={9}>
                                    <Input type="number" name="min" id="min" placeholder="write a number" />
                                </Col>
                            </FormGroup>
                            <FormGroup row className={"mt-3"}>
                                <Label for="max" sm={3}>Max users</Label>
                                <Col sm={9}>
                                    <Input type="number" name="max" id="max" placeholder="write a number" />
                                </Col>
                            </FormGroup>
                            <FormGroup row className={"mt-3"}>
                                <Label for="date_from" sm={3}>Date from</Label>
                                <Col sm={9}>
                                    <Input type="date" name="date_from" id="date_from" placeholder="select date" />
                                </Col>
                            </FormGroup>
                            <FormGroup row className={"mt-3"}>
                                <Label for="date_to" sm={3}>Date to</Label>
                                <Col sm={9}>
                                    <Input type="date" name="date_to" id="date_to" placeholder="select date" />
                                </Col>
                            </FormGroup>

                            <Button type={"default"} className={"float-right mt-3"}>Submit</Button>

                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(CoursesOptionsTeam))