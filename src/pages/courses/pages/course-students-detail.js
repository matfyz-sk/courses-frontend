import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Badge, ListGroup, ListGroupItem, Collapse, Input, FormGroup, Label, Form } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesStudentsDetail extends Component {
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

        const render_points = [];
        for (let i = 0; i < 4; i++) {
            render_points.push(
                <ListGroupItem action>
                    <Row>
                        <Col xs={8} className={"p-0"}>
                            Homework {i}
                        </Col>
                        <Col xs={4} className={"p-0"}>
                            <Form inline>
                                <FormGroup>
                                    <Input  size="sm" type={"number"} style={{width: 80}} value={Math.floor(Math.random() * Math.floor(10))} name="points" id={"points-"+i} />
                                    <Label for={"points-"+i} className="ml-sm-2 mr-sm-2">/ 10</Label>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </ListGroupItem>
            )
        }

        return (
            <div className={"content-padding"}>
                <Sidebar />

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses">Courses</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses/detail">Výpočtová logika</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses/detail/students">Students</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Patrik Hudák</BreadcrumbItem>
                </Breadcrumb>

                <h1>Patrik Hudák in Výpočtová logika</h1>
                <Row>
                    <Col xs={12} sm={6} className={"mt-5"}>
                        <p><b>Points</b></p>
                        <ListGroup>
                            {render_points}
                        </ListGroup>

                        <ListGroup className={"mt-3"}>
                            <ListGroupItem action color="dark">
                                <Row>
                                    <Col xs={8} className={"p-0"}>
                                        TOTAL
                                    </Col>
                                    <Col xs={4} className={"p-0"}>
                                        <Form inline>
                                            <FormGroup>
                                                <Input  size="sm" type={"number"} style={{width: 80}} value={27} disabled={true} name="points" id={"summary"} />
                                                <Label for={"summary"} className="ml-sm-2 mr-sm-2">/ 40</Label>
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col xs={12} sm={6} className={"mt-5"}>
                        <p><b>Also in teams</b></p>
                        <ListGroup>
                            <ListGroupItem action onClick={()=>this.handleOpen(0)}>
                                <Row>
                                    <Col xs={9} className={"p-0"}>
                                        Programming <br/>
                                        <Link to={"/courses/detail/teams/detail"}><small>Hudak, Hudak, Hudak</small></Link>
                                    </Col>
                                    <Col xs={2} className={"p-0"}>7 / 10</Col>
                                    <Col xs={1} className={"p-0 text-right"}><i className={"fa fa-chevron-down"} /></Col>
                                </Row>
                                <Collapse isOpen={isOpen[0]} className={"mt-2"}>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}><b>Patrik Hudák 1</b></Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge color={"success"}>Current</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 2</Col>
                                        <Col xs={2} className={"p-0"}>10 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 3</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>

                                        </Col>
                                    </Row>
                                </Collapse>
                            </ListGroupItem>
                            <ListGroupItem action onClick={()=>this.handleOpen(1)}>
                                <Row>
                                    <Col xs={9} className={"p-0"}>
                                        Diagrams <br/>
                                        <Link to={"/courses/detail/teams/detail"}><small>Hudak, Hudak, Hudak</small></Link>
                                    </Col>
                                    <Col xs={2} className={"p-0"}>7 / 10</Col>
                                    <Col xs={1} className={"p-0 text-right"}><i className={"fa fa-chevron-down"} /></Col>
                                </Row>
                                <Collapse isOpen={isOpen[1]} className={"mt-2"}>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}><b>Patrik Hudák 1</b></Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>
                                            <Badge color={"success"}>Current</Badge>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 2</Col>
                                        <Col xs={2} className={"p-0"}>10 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={8} className={"p-0 pl-3"}>Patrik Hudák 3</Col>
                                        <Col xs={2} className={"p-0"}>7 / 10</Col>
                                        <Col xs={2} className={"p-0 text-right"}>

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

export default withRouter(connect(mapStateToProps)(CoursesStudentsDetail))