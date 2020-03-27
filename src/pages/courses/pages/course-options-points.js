import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesOptionsPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article_id: props.match.params.article,
            form: {
                name: "",
                description: "",
                max_points: 0,
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
                    <BreadcrumbItem active>Points criteria</BreadcrumbItem>
                </Breadcrumb>

                <h1>Points criteria of {article_id ? "article id " + article_id : 'course'}</h1>
                <Row>
                    <Col sm={8} xs={12} className={"mt-5"}>
                        <Form>
                            <FormGroup row>
                                <Label for="name" sm={4}>Name of criteria</Label>
                                <Col sm={8}>
                                    <Input type="text" name="name" id="name" placeholder="name of this criteria" />
                                </Col>
                            </FormGroup>
                            <FormGroup row className={"mt-3"}>
                                <Label for="description" sm={4}>Description of criteria</Label>
                                <Col sm={8}>
                                    <Input type="textarea" name="description" id="description" placeholder="short description" />
                                </Col>
                            </FormGroup>
                            <FormGroup row className={"mt-3"}>
                                <Label for="max" sm={4}>Max points</Label>
                                <Col sm={8}>
                                    <Input type="number" name="max" id="max" placeholder="write a number" />
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

export default withRouter(connect(mapStateToProps)(CoursesOptionsPoints))