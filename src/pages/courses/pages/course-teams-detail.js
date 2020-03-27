import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Table, Badge, ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesTeamsDetail extends Component {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.state = {
            isOpen: [false, false]
        }
    }

    handleOpen(index) {
        const isOpen = this.state.isOpen;
        const is_openend = this.state.isOpen[index];
        for(let i = 0; i < isOpen.length; i++) {
            isOpen[i] = false;
        }
        if(!is_openend) {
            isOpen[index] = true;
        }
        this.setState({isOpen})
    }

    render() {
        const {isOpen} = this.state;

        const render_members = [];
        for (let i = 0; i < 3; i++) {
            render_members.push(
                <tr>
                    <th scope="row">Patrik Hudák {i+1}</th>
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
                    <BreadcrumbItem><Link to="/courses/detail/teams">Teams</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Hudak 1, Hudak 2, Hudak 3</BreadcrumbItem>
                </Breadcrumb>

                <h1>Team detail of Výpočtová logika</h1>
                <Row>
                    <Col xs={12} sm={6} className={"mt-5"}>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                                {render_members}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} sm={6} className={"mt-5"}>
                        <Table borderless size="sm">
                            <thead>
                                <tr colSpan="2">
                                    <th>Team criteria</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Date from</td>
                                    <td>20.03.2020</td>
                                </tr>
                                <tr>
                                    <td>Date to</td>
                                    <td>20.05.2020</td>
                                </tr>
                                <tr>
                                    <td>Range</td>
                                    <td>2 - 5 students</td>
                                </tr>
                            </tbody>
                        </Table>

                        <p><b>Points</b></p>
                        <ListGroup>
                            <ListGroupItem action onClick={()=>this.handleOpen(0)}>
                                <Row>
                                    <Col xs={9} className={"p-0"}>Programming</Col>
                                    <Col xs={2} className={"p-0"}>24 / 30</Col>
                                    <Col xs={1} className={"p-0 text-right"}><i className={"fa fa-chevron-down"} /></Col>
                                </Row>
                                <Collapse isOpen={isOpen[0]} className={"mt-2"}>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 1</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 2</Col>
                                        <Col xs={2} className={"p-0"}>10 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 3</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                </Collapse>
                            </ListGroupItem>
                            <ListGroupItem action  onClick={()=>this.handleOpen(1)}>
                                <Row>
                                    <Col xs={9} className={"p-0"}>Diagrams</Col>
                                    <Col xs={2} className={"p-0"}>24 / 30</Col>
                                    <Col xs={1} className={"p-0 text-right"}><i className={"fa fa-chevron-down"} /></Col>
                                </Row>
                                <Collapse isOpen={isOpen[1]} className={"mt-2"}>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 1</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 2</Col>
                                        <Col xs={2} className={"p-0"}>10 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 3</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge>Change</Badge>
                                        </Col>
                                    </Row>
                                </Collapse>
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(CoursesTeamsDetail))