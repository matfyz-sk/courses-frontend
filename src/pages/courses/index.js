import React, { Component } from 'react';
import { Col, Row, Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle, Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class Courses extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const render_courses = [];
        for (let i = 0; i < 100; i++) {
            render_courses.push(
                <tr>
                    <th scope="row">2-AIN-108/15</th>
                    <td>Výpočtová logika</td>
                    <td>2P + 2C</td>
                    <td>1/Z</td>
                    <td>6 kr.</td>
                    <td>M. Homola</td>
                    <td><Link to='/courses/detail'>DETAIL</Link></td>
                </tr>
            )
        }

        return (
            <React.Fragment>
                <h1>Courses</h1>
                <Row>
                    <Col xs={12}>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>CODE</th>
                                    <th>Course name</th>
                                    <th>Range</th>
                                    <th>Semester</th>
                                    <th>Credits</th>
                                    <th>Teacher</th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {render_courses}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(Courses))