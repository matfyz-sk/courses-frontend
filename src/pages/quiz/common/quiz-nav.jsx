import React from 'react'
import { Nav, Navbar, NavItem, NavLink } from 'reactstrap'
import { NavLink as NV } from 'react-router-dom'

const QuizNav = ({match}) => {

  return (
    <Navbar style={ {padding: "0px"} } className="mb-4" light expand>
      { match && match.params && match.params.course_id && (
        <Nav navbar tabs fill style={ {width: "100%", fontSize: "150%"} }>
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
        </Nav>) }
    </Navbar>
  )
}
export default QuizNav
