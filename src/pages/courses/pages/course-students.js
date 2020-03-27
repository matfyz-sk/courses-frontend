import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Table, Badge, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesStudents extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const render_students = [];
        for (let i = 0; i < 20; i++) {
            render_students.push(
                <tr>
                    <th scope="row">Patrik Hudák</th>
                    <td>
                        <Badge href="#" color="secondary" className={"mr-2"}>Team1</Badge>
                        <Badge href="#" color="secondary" className={"mr-2"}>Team2</Badge>
                        <Badge href="#" color="secondary" className={"mr-2"}>Team3</Badge>
                    </td>
                    <td>
                        {i % 3 === 0 ?
                            <Badge color="danger">Declined</Badge>
                        :
                            (i % 2 === 0 ?
                                <Badge color="secondary">Waiting</Badge>
                            :
                                <Badge color="success">Approved</Badge>
                            )
                        }
                    </td>
                    <td><Link to='/courses/detail/students/detail'>DETAIL</Link></td>
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
                    <BreadcrumbItem active>Students</BreadcrumbItem>
                </Breadcrumb>

                <h1>Students of Výpočtová logika</h1>
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
                                    <Button>Add student</Button>
                                </Col>
                            </Row>

                        </Form>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Teams</th>
                                <th>Status</th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                                {render_students}
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

export default withRouter(connect(mapStateToProps)(CoursesStudents))