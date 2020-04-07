import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Button } from "reactstrap";
import api from "../../../../api";

import AssignmentPreview from "./assignment-preview/assignment-preview";

class QuizAssignmentsOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      assignmentCollapse: []
    };
  }
  toggle = index => e => {
    e.preventDefault();
    let updatedAssignmentCollapse = this.state.assignmentCollapse;
    updatedAssignmentCollapse[index] = !updatedAssignmentCollapse[index];
    this.setState({ assignmentCollapse: updatedAssignmentCollapse });
  };
  getAssignments = () => {
    fetch(api.quiz.fetchQuizAssignments(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.props.isAdmin
          ? "http://www.semanticweb.org/semanticweb#Teacher"
          : "http://www.semanticweb.org/semanticweb#Adam"
      })
    }).then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            this.setState({
              assignments: data,
              assignmentCollapse: new Array(data.length).fill(false)
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };
  componentDidMount() {
    this.getAssignments();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAdmin !== this.props.isAdmin) this.getAssignments();
  }

  render() {
    const { assignmentCollapse, assignments } = this.state;
    const { isAdmin, history } = this.props;
    return (
      <React.Fragment>
        <h1>Quizzes</h1>
        <div>
          {assignments.map((assignment, index) => {
            return (
              <Card tag={"article"} key={assignment.id}>
                <AssignmentPreview
                  {...assignment}
                  isTeacher={isAdmin ? true : false}
                  toggle={this.toggle(index)}
                  collapse={assignmentCollapse[index]}
                  history={history}
                />
              </Card>
            );
          })}
          {isAdmin ? (
            <Button color="success" tag={Link} to={"/quiz/quizAssignment"}>
              Create quiz assignment
            </Button>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer;
  return {
    isAdmin
  };
};

export default connect(mapStateToProps, {})(QuizAssignmentsOverview);
