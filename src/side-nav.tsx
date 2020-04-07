import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as NV } from 'react-router-dom';

const SideNav = () => {
  return (
    <Nav vertical>
      <NavItem>
        <NavLink tag={NV} to="/quiz/questionGroups">
          Questions
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={NV} to="/quiz/quizAssignmentsOverview">
          Quizzes
        </NavLink>
      </NavItem>
    </Nav>
  );
};
export default SideNav;
