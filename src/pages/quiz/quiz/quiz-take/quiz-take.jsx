import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button } from "reactstrap";
import api from "../../../../api";
import SavedQuestion from "../../common/saved-question";

export class QuizTake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizTakeId: "",
      orderedQuestions: {}
    };
  }
  getQuizTake = () => {
    fetch(
      api.quiz.fetchGetQuizTake() +
        encodeURIComponent(this.props.match.params.id),
      {
        method: "GET",
        headers: {
          token: this.props.isAdmin
            ? "http://www.semanticweb.org/semanticweb#Teacher"
            : "http://www.semanticweb.org/semanticweb#Adam"
          //TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
        }
      }
    ).then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            let orderedQuestions = {};
            data.orderedQuestions.forEach(question => {
              const answers = {};
              question.questionVersion.answers.forEach(answer => {
                answers[answer.id] = {
                  id: answer.id,
                  correct: answer.correct ? answer.correct : false,
                  text: answer.text
                };
              });
              console.log(question.userAnswers);
              orderedQuestions[question.id] = {
                id: question.id,
                text: question.questionVersion.text,
                answers: answers
              };
              if (question.userAnswers) {
                orderedQuestions[question.id].userAnswers =
                  question.userAnswers;
              }
              if (question.score !== undefined) {
                orderedQuestions[question.id].score = question.score;
              }
            });
            console.log(orderedQuestions);

            this.setState({
              quizTakeId: data.id,
              orderedQuestions: orderedQuestions,
              isSubmited: data.isSubmited,
              isReviewed: data.isReviewed
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  onChange = (event, orderedQuestionId) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const orderedQuestion = this.state.orderedQuestions[orderedQuestionId];
    const answer = orderedQuestion.answers[name];
    answer.correct = value;
    orderedQuestion.answers[name] = answer;
    this.setState({
      orderedQuestions: {
        ...this.state.orderedQuestions,
        [orderedQuestionId]: orderedQuestion
      }
    });
  };

  onScore = (event, orderedQuestionId) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const orderedQuestion = this.state.orderedQuestions[orderedQuestionId];
    orderedQuestion.score = value;
    this.setState({
      orderedQuestions: {
        ...this.state.orderedQuestions,
        [orderedQuestionId]: orderedQuestion
      }
    });
  };

  formSubmitUserAnswers = () => {
    const orderedQuestions = Object.values(this.state.orderedQuestions);
    orderedQuestions.forEach(orderedQuestion => {
      orderedQuestion.answers = Object.values(orderedQuestion.answers);
    });
    const data = {
      quizTakeId: this.state.quizTakeId,
      orderedQuestions: orderedQuestions,
      token: this.props.isAdmin
        ? "http://www.semanticweb.org/semanticweb#Teacher"
        : "http://www.semanticweb.org/semanticweb#Adam"
      //TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
    };
    fetch(api.quiz.fetchSubmitQuizTake(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        this.props.history.push("/quiz/quizAssignmentsOverview");
      }
    });
  };
  formSubmitReview = () => {
    const orderedQuestionScore = [];
    const orderedQuestions = Object.values(this.state.orderedQuestions);
    orderedQuestions.forEach(orderedQuestion => {
      orderedQuestionScore.push({
        id: orderedQuestion.id,
        score: orderedQuestion.score
      });
    });
    const data = {
      quizTakeId: this.state.quizTakeId,
      orderedQuestions: orderedQuestionScore,
      token: this.context.userType
    };
    fetch(api.quiz.fetchSubmitReview(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        this.props.history.push("/quiz/quizAssignmentsOverview");
      }
    });
  };

  componentDidMount() {
    this.getQuizTake();
  }

  componentDidUpdate(prevProps) {
    const { match, isAdmin } = this.props;
    if (
      match.params.id !== prevProps.match.params.id ||
      isAdmin !== prevProps.isAdmin
    ) {
      this.getQuizTake();
    }
  }

  render() {
    const { orderedQuestions, isSubmited, isReviewed } = this.state;
    const { isAdmin } = this.props;
    console.log(orderedQuestions);
    return (
      <Form>
        {Object.keys(orderedQuestions).map(key => {
          const value = orderedQuestions[key];
          return (
            <SavedQuestion
              key={key}
              isQuizTake={!isSubmited && !isReviewed}
              isPreview={isSubmited || isReviewed}
              isSubmited={isSubmited}
              isReviewed={isReviewed}
              userAnswers={
                "userAnswers" in value
                  ? Object.values(value.userAnswers)
                  : undefined
              }
              score={"score" in value ? value.score : undefined}
              text={value.text}
              answers={Object.values(value.answers)}
              onChange={e => this.onChange(e, key)}
              onScore={e => this.onScore(e, key)}
              isTeacher={isAdmin ? true : false}
            />
          );
        })}
        {(!isAdmin && !isSubmited && !isReviewed) ||
        (isAdmin && !isSubmited && !isReviewed) ? (
          <Button color="success" onClick={() => this.formSubmitUserAnswers()}>
            Submit
          </Button>
        ) : null}
        {isAdmin && (isSubmited || isReviewed) ? (
          <Button color="success" onClick={() => this.formSubmitReview()}>
            Submit review
          </Button>
        ) : null}
      </Form>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer;
  return {
    isAdmin
  };
};

export default connect(mapStateToProps, {})(QuizTake);
