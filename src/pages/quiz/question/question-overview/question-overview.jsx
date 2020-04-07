import React, { Component } from "react";
import { connect } from "react-redux";
import Question from "../question/question";
import SavedQuestion from "../../common/saved-question";
import { Button } from "reactstrap";
import api from "../../../../api";
class QuestionOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionVersions: [],
      isEdit: false,
      allQuestionTypes: {},
      title: "",
      approvedAsPublicId: "",
      approvedAsPrivateId: "",
      lastSeenByStudent: "",
      lastSeenByTeacher: "",
      lastChange: ""
    };
  }

  getAllQuestionTypes = () => {
    fetch(api.quiz.fetchQuestionTypes()).then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            if (data && data.length && data.length > 0) {
              let questionTypeMap = new Map();
              data.forEach(questionType => {
                questionTypeMap.set(questionType.id, questionType.name);
              });
              this.setState({
                allQuestionTypes: questionTypeMap
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  getQuestionVersions = () => {
    fetch(
      api.quiz.fetchGetQuestionVersions() + this.props.match.params.id
    ).then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            if (data) {
              this.setState({
                title: data.title,
                selectedTopic: data.topic,
                lastSeenByStudent: data.lastSeenByStudent,
                lastSeenByTeacher: data.lastSeenByTeacher,
                lastChange: data.lastChange,
                approvedAsPublicId: data.approvedAsPublicId,
                approvedAsPrivateId: data.approvedAsPrivateId,
                questionVersions: data.questionVersions
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  componentDidMount() {
    this.getAllQuestionTypes();
    this.getQuestionVersions();
  }

  onSendComment = (questionVersionId, newComment) => {
    const data = {
      questionId: this.props.match.params.id,
      questionVersionId: questionVersionId,
      newComment: newComment,
      token: this.props.isAdmin
        ? "http://www.semanticweb.org/semanticweb#Teacher"
        : "http://www.semanticweb.org/semanticweb#Adam"
      //TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
    };
    fetch(api.quiz.fetchAddComment(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        this.getQuestionVersions();
      }
    });
  };
  render() {
    const { isAdmin } = this.props;
    let lastKnownQuestionVersion =
      this.state.questionVersions && this.state.questionVersions.length
        ? this.state.questionVersions[0]
        : null;
    return (
      <React.Fragment>
        <h1>{this.state.title}</h1>
        {/* TODO show edit question only if author === user */}
        <Button onClick={() => this.setState({ isEdit: !this.state.isEdit })}>
          Edit question
        </Button>
        {this.state.isEdit && lastKnownQuestionVersion ? (
          <Question
            questionId={decodeURIComponent(this.props.match.params.id)}
            title={this.state.title}
            text={lastKnownQuestionVersion.text.value}
            answers={lastKnownQuestionVersion.answers}
            topic={this.state.selectedTopic.id}
            questionType={lastKnownQuestionVersion.questionType}
            history={this.props.history}
          />
        ) : null}
        {this.state.questionVersions.map(questionVersion => {
          return (
            <SavedQuestion
              key={questionVersion.id}
              id={questionVersion.id}
              title={this.state.title}
              text={questionVersion.text}
              answers={questionVersion.answers}
              topic={this.state.selectedTopic.name}
              questionType={this.state.allQuestionTypes.get(
                questionVersion.questionType
              )}
              comments={questionVersion.comments}
              onSendComment={this.onSendComment}
              isApprovedAsPublic={
                this.state.approvedAsPublicId === questionVersion.id
              }
              isApprovedAsPrivate={
                this.state.approvedAsPrivateId === questionVersion.id
              }
              isTeacher={isAdmin ? true : false}
              history={this.props.history}
              isPreview={true}
            />
          );
        })}
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

export default connect(mapStateToProps, {})(QuestionOverview);
