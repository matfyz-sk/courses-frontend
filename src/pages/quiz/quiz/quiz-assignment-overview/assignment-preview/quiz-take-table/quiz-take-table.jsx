import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Table, NavLink, CardSubtitle } from "reactstrap";
class QuizTakeTable extends Component {
  render() {
    const {
      headerText,
      authorHeader,
      scoreHeader,
      questions,
      link
    } = this.props;
    return (
      <React.Fragment>
        <CardSubtitle tag={"h4"} className={"h5"}>
          {headerText}
        </CardSubtitle>
        <Table hover striped size="sm">
          <thead>
            <tr>
              {authorHeader ? <th className={"h6"}>{authorHeader}</th> : null}
              {scoreHeader ? <th className={"h6"}>{scoreHeader}</th> : null}
            </tr>
          </thead>
          <tbody>
            {questions
              ? questions.map(question => {
                  return (
                    <tr key={question.id}>
                      <td>
                        <NavLink
                          tag={Link}
                          to={link + encodeURIComponent(question.id)}
                          color="primary"
                        >
                          {question.author.name}
                        </NavLink>
                      </td>
                      <td>
                        <NavLink
                          tag={Link}
                          to={link + encodeURIComponent(question.id)}
                          color="primary"
                        >
                          {question.totalScore}
                        </NavLink>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default QuizTakeTable;
