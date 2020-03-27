import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Table, Badge } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesTeams extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const render_teams = [];
        for (let i = 0; i < 20; i++) {
            render_teams.push(
                <tr>
                    <th scope="row">Hudak, Hudak, Hudak</th>
                    <td><Link to={'/courses/detail'}>Výpočtová logika</Link></td>
                    <td>22.03.2020</td>
                    <td><Badge color="success">Approved</Badge></td>
                    <td><Link to='/courses/detail/teams/detail'>DETAIL</Link></td>
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
                    <BreadcrumbItem active>Teams</BreadcrumbItem>
                </Breadcrumb>

                <h1>Teams of Výpočtová logika</h1>
                <Row>
                    <Col xs={12} className={"mt-5"}>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Belongs to</th>
                                <th>Created at</th>
                                <th>Status</th>
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

export default withRouter(connect(mapStateToProps)(CoursesTeams))