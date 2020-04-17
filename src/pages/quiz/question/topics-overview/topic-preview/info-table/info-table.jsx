/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { CardSubtitle, Table, NavLink, Badge } from 'reactstrap'

function InfoTable(props) {
  const { headerText, questions, link } = props
  return (
    <>
      <CardSubtitle tag="h4" className="h5">
        {headerText}
      </CardSubtitle>
      <Table hover striped size="sm">
        <tbody>
          {questions
            ? questions.map(question => {
                const questionAnswerAddress = question.id.substr(
                  question.id.lastIndexOf('/', question.id.lastIndexOf('/') - 1)
                )
                return (
                  <tr key={question.id}>
                    <td>
                      <NavLink
                        tag={Link}
                        to={link + questionAnswerAddress}
                        color="primary"
                        className="font-weight-bold"
                      >
                        {`${question.title} `}

                        {/* {isTeacher &&
                        question.lastSeenByTeacher &&
                        question.lastChange ? (
                          new Date(question.lastSeenByTeacher) <
                          new Date(question.lastChange) ? (
                            <Badge color="danger">Updated</Badge>
                          ) : null
                        ) : question.lastSeenByStudent &&
                          question.lastChange &&
                          new Date(question.lastSeenByStudent) <
                            new Date(question.lastChange) ? (
                          <Badge color="danger">Updated</Badge>
                        ) : null} */}
                        <br />
                        <small className="text-muted">
                          {question && question.author && question.author.name}
                        </small>
                      </NavLink>
                    </td>
                  </tr>
                )
              })
            : null}
        </tbody>
      </Table>
    </>
  )
}

InfoTable.propTypes = {
  headerText: PropTypes.string,
  isTeacher: PropTypes.bool,
  link: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.any),
  courseInstance: PropTypes.any,
  topics: PropTypes.any,
  isAdmin: PropTypes.bool,
}

InfoTable.defaultProps = {
  headerText: null,
  isTeacher: null,
  link: null,
  questions: null,
  courseInstance: null,
  topics: null,
  isAdmin: null,
}

export default InfoTable
