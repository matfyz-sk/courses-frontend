import React from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { NavLink as NV } from 'react-router-dom'

const SideNav = (match: any) => {
  return (
    <Nav vertical>
      <NavItem>
        <NavLink
          tag={NV}
          to={`/courses/${match.params.courseId}/quiz/questionGroups`}
        >
          Questions
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          tag={NV}
          to={`/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`}
        >
          Quizzes
        </NavLink>
      </NavItem>
    </Nav>
  )
}
export default SideNav
