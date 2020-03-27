import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Table, Badge, Form, FormGroup, Button, Input } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesTeachers extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const render_teams = [];
        for (let i = 0; i < 4; i++) {
            render_teams.push(
                <tr>
                    <th scope="row">Patrik Hudák</th>
                    <td><Badge color="success">Approved</Badge></td>
                    <td>
                        {i === 3 ?
                            <Badge color="warning"><i className={"fa fa-star"} /> ADMIN</Badge>
                        : ""}
                    </td>
                    <td></td>
                </tr>
            )
        }

        return (
            <div className={"content-padding"}>
                <Sidebar />

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses">Courses</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses/detail">Výpočtová logika</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Teachers</BreadcrumbItem>
                </Breadcrumb>

                <h1>Teachers of Výpočtová logika</h1>
                <Row>
                    <Col xs={12} className={"mt-5"}>
                        <Form className={"mb-3"}>
                            <Row form>
                                <Col md={5}>
                                    <FormGroup>
                                        <Input type="email" name="email" id="email" placeholder="Add new student by email" />
                                    </FormGroup>
                                </Col>
                                <Col md={2}>
                                    <Button>Add teacher</Button>
                                </Col>
                            </Row>

                        </Form>

                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th> </th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                            {render_teams}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(CoursesTeachers))