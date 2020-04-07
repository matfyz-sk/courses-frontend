import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  CardSubtitle,
  CardBody,
  CardLink,
  CardText,
  Collapse,
  Button,
  Row,
  Col
} from "reactstrap";

import api from "../../../../../api";

import QuizTakeTable from "./quiz-take-table/quiz-take-table";

class AssignmentPreview extends Component {
  generateQuizTake = quizAssignmentId => {
    const { history, isAdmin } = this.props;
    fetch(
      api.quiz.fetchGenerateQuizTake() + encodeURIComponent(quizAssignmentId),
      {
        method: "GET",
        headers: {
          token: isAdmin
            ? "http://www.semanticweb.org/semanticweb#Teacher"
            : "http://www.semanticweb.org/semanticweb#Adam"
        }
      }
    ).then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            history.push("/quiz/quizTake/" + encodeURIComponent(data));
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  render() {
    let quizTakenReviewed = [];
    let quizTakenNotReviewed = [];
    if (this.props.quizTakes) {
      this.props.quizTakes.forEach(quiz => {
        quiz.isReviewed
          ? quizTakenReviewed.push(quiz)
          : quizTakenNotReviewed.push(quiz);
      });
    }
    return (
      <React.Fragment>
        <CardBody>
          <h2 className={"h3"}>{this.props.title}</h2>
          <CardLink href="#" onClick={this.props.toggle}>
            expand
          </CardLink>
        </CardBody>
        <Collapse isOpen={this.props.collapse}>
          <CardBody className="pt-0">
            <CardSubtitle tag={"h3"} className={"h4"}>
              Assignment
            </CardSubtitle>
            <CardText>{this.props.description}</CardText>
            <CardText>
              Start date:
              {" " + new Date(this.props.startTime).toLocaleDateString()}
            </CardText>
            <CardText>
              End date:
              {" " + new Date(this.props.endTime).toLocaleDateString()}
            </CardText>
            {this.props.isTeacher ? (
              <Button
                color="primary"
                tag={Link}
                to={"/quiz/quizAssignment/" + encodeURIComponent(this.props.id)}
              >
                Edit assignment
              </Button>
            ) : null}
          </CardBody>
          <CardBody>
            <CardSubtitle tag={"h3"} className={"h4"}>
              Quiz takes
            </CardSubtitle>
            <Row>
              {quizTakenNotReviewed ? (
                <Col xs="12" md="6">
                  <QuizTakeTable
                    headerText={"Submitted"}
                    authorHeader={"Author"}
                    questions={quizTakenNotReviewed}
                    link={"/quiz/quizTake/"}
                  />
                </Col>
              ) : null}
              {quizTakenReviewed ? (
                <Col xs="12" md="6">
                  <QuizTakeTable
                    headerText={"Scored"}
                    authorHeader={"Author"}
                    scoreHeader={"Score"}
                    questions={quizTakenReviewed}
                    link={"/quiz/quizTake/"}
                  />
                </Col>
              ) : null}
            </Row>
            {(new Date(this.props.startTime) < new Date() &&
              new Date(this.props.endTime) > new Date()) ||
            this.props.isTeacher ? (
              <Button
                color="primary"
                onClick={() => this.generateQuizTake(this.props.id)}
              >
                Take Quiz
              </Button>
            ) : null}
          </CardBody>
        </Collapse>
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

export default connect(mapStateToProps, {})(AssignmentPreview);
