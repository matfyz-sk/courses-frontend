import React from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { NavLink as NV } from 'react-router-dom'

const SideNav = ({match}) => {
  return (
    <Nav vertical>
      { match && match.params && match.params.course_id && (
        <>
          <NavItem>
            <NavLink
              tag={ NV }
              to={ `/courses/${ match.params.course_id }/quiz/questionGroups` }
            >
              Questions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={ NV }
              to={ `/courses/${ match.params.course_id }/quiz/quizAssignmentsOverview` }
            >
              Quizzes
            </NavLink>
          </NavItem>
        </>
      ) }
    </Nav>
  )
}
export default SideNav
