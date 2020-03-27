import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Form, FormGroup, Label, Input, Button, Table, Badge } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesPointsAssignment extends Component {
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
        const render_users = [];
        for (let i = 0; i < 20; i++) {
            render_users.push(
                <tr>
                    <th scope="row">Patrik Hudák</th>
                    <td>22.03.2020</td>
                    <td>
                        <Badge color={"success"}>team name</Badge>
                    </td>
                    <td className={"text-right"} style={{maxWidth: 200}}>
                        <FormGroup row>
                            <Col sm={8}>
                                <Input type="number" name="max" id="max" placeholder="" />
                            </Col>
                            <Label for="max" sm={4}> / 10</Label>
                        </FormGroup>
                    </td>
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
                    <BreadcrumbItem active>Points assignment</BreadcrumbItem>
                </Breadcrumb>

                <h1>Points assignment of {article_id ? "article id " + article_id : 'course'}</h1>
                <Row className={"mt-4 text-right"}>
                    <Col xs={12}>
                        <Link to={"/courses/detail/options/points/"+article_id} size={"sm"} className={"btn btn-secondary btn-sm"}>Set points criteria</Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox" /> Team work
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className={"mt-2"}>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>In team</th>
                                <th>Points</th>
                            </tr>
                            </thead>
                            <tbody>
                                {render_users}
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

export default withRouter(connect(mapStateToProps)(CoursesPointsAssignment))