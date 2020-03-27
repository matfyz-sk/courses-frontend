import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Button, Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesArticles extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const render_articles = [];
        for (let i = 0; i < 10; i++) {
            render_articles.push(
                <tr>
                    <th scope="row">Name of article</th>
                    <td>other actions</td>
                    {i % 3 === 0 ?
                        <td>
                            <Link to={"/courses/detail/points/"+i} size={"sm"} className={"btn btn-primary btn-sm"}>Set points</Link>
                        </td>
                    :
                        <td>
                            <Link to={"/courses/detail/options/points/"+i} size={"sm"} className={"btn btn-secondary btn-sm"}>Set points criteria</Link>
                        </td>
                    }
                    <td>
                        <Link to={"/courses/detail/options/team/"+i} size={"sm"} className={"btn btn-secondary btn-sm"}>Team options</Link>
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
                    <BreadcrumbItem active>Articles</BreadcrumbItem>
                </Breadcrumb>

                <h1>Articles of Výpočtová logika</h1>
                <Row>
                    <Col xs={12} className={"mt-2"}>
                        <Link to={"/courses/detail/options/team"} size={"sm"} className={"btn btn-secondary btn-sm float-right"}>Course team options</Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className={"mt-3"}>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Other actions</th>
                                <th>Criteria</th>
                                <th>Teams</th>
                            </tr>
                            </thead>
                            <tbody>
                            {render_articles}
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

export default withRouter(connect(mapStateToProps)(CoursesArticles))