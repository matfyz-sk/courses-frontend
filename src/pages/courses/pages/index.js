import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesDetail extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={"content-padding"}>
                <Sidebar />

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses">Courses</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Výpočtová logika</BreadcrumbItem>
                </Breadcrumb>

                <h1>Výpočtová logika</h1>
                <h3 className={"text-muted"}>M. Homola</h3>
                <Row>
                    <Col xs={12} className={"mt-5"}>
                        <h2>CONTENT</h2>
                    </Col>
                </Row>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(CoursesDetail))