import React from 'react';
import SidebarWrapper from '../../../components/sidebar/index';
import { Link } from "react-router-dom";

const Sidebar = () => (
    <React.Fragment>
        <SidebarWrapper>
            <li className="nav-item" key={1}>
                <Link className="nav-link pl-0 text-nowrap" to="/courses/detail/articles">
                    <i className="fa fa-book-open fa-fw mr-3"> </i> <span className="font-weight-bold">Articles</span>
                </Link>
            </li>
            <li className="nav-item" key={2}>
                <Link className="nav-link pl-0 text-nowrap" to="/courses/detail/badges">
                    <i className="fa fa-shield-alt fa-fw mr-3"> </i> <span className="font-weight-bold">Badges</span></Link>
            </li>
            <li className="nav-item" key={3}>
                <Link className="nav-link pl-0 text-nowrap" to="/courses/detail/teams">
                    <i className="fa fa-user-friends fa-fw mr-3"> </i> <span className="font-weight-bold">Teams</span></Link>
            </li>
            <li className="nav-item" key={4}>
                <Link className="nav-link pl-0 text-nowrap" to="/courses/detail/students">
                    <i className="fa fa-graduation-cap fa-fw mr-3"> </i> <span className="font-weight-bold">Students</span></Link>
            </li>
            <li className="nav-item" key={5}>
                <Link className="nav-link pl-0 text-nowrap" to="/courses/detail/teachers">
                    <i className="fa fa-chalkboard-teacher fa-fw mr-3"> </i> <span className="font-weight-bold">Teachers</span></Link>
            </li>
        </SidebarWrapper>
    </React.Fragment>
);

export default Sidebar;