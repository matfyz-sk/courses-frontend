import React, { Component } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class CoursesBadges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
        }
    }
    render() {
        const {editMode} = this.state;
        const badges = [];
        for(let i = 0; i < (editMode ? 30 : 6); i++) {
            badges.push(
                <Col xs={3} className={"mt-4"} key={"badge-"+i}>
                    <div className={"position-relative"}>
                        <div className={"position-absolute w-100 h-100 " + (i < 6 ? "selected-gradient" : "unselected-gradient")} />
                        <img src={"https://picsum.photos/200?"+i} alt={"badge"} className={"w-100"} />
                    </div>
                </Col>
            );
        }

        return (
            <div className={"content-padding"}>
                <Sidebar />

                <Breadcrumb>
                    <BreadcrumbItem><Link to="/dashboard">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses">Courses</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/courses/detail">Výpočtová logika</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Badges</BreadcrumbItem>
                </Breadcrumb>

                <h1>Badges of Výpočtová logika</h1>
                <Row>
                    <Col xs={12} className={"mt-3 text-right"}>
                        {editMode ?
                            <Button color="secondary" onClick={()=>this.setState({editMode: false})}>SAVE</Button>
                        :
                            <Button color="secondary" onClick={()=>this.setState({editMode: true})}>EDIT</Button>
                        }
                    </Col>
                    {badges}
                </Row>
            </div>
        )
    }
}


const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(CoursesBadges))