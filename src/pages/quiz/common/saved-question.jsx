import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Label,
  FormGroup,
  CardTitle,
  Input,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  InputGroup,
  InputGroupAddon,
  Card,
  CardBody,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import AnswerComponent from '../question/common/answer-component/answer-component'
import api from '../../../api'

class SavedQuestion extends Component {
  state = {
    newComment: '',
    dropdownOpen: false,
  }

  changeHandler = e => {
    const { name } = e.target
    const { value } = e.target
    this.setState({
      [name]: value,
    })
  }

  toggle = () => {
    this.setState(prevProps => {
      return {
        dropdownOpen: !prevProps.dropdownOpen,
      }
    })
  }

  onApprove = isPrivate => {
    fetch(api.quiz.fetchApproveQuestionVersion(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.props.isAdmin
          ? 'http://www.semanticweb.org/semanticweb#Teacher'
          : 'http://www.semanticweb.org/semanticweb#Adam',
        questionVersionUri: this.props.id,
        isPrivate,
      }),
    }).then(response => {
      if (response.ok) {
        this.props.history.push('/quiz/questionGroups')
      }
    })
  }

  // TODO make questionVersion green when approved
  render() {
    const {
      isQuizTake,
      isSubmited,
      isReviewed,
      isApprovedAsPublic,
      isApprovedAsPrivate,
      title,
      topic,
      text,
      questionType,
      answers,
      userAnswers,
      onChange,
      isPreview,
      isTeacher,
      score,
      onScore,
      comments,
      onSendComment,
      id,
    } = this.props
    return (
      <div className="question">
        <Card>
          <CardBody>
            {isApprovedAsPublic ? <div>Approved as Public</div> : null}
            {isApprovedAsPrivate ? <div>Approved as Private</div> : null}
            {isQuizTake || isSubmited || isReviewed ? (
              <CardTitle>{title}</CardTitle>
            ) : (
              <FormGroup>
                <Label for="title">Title</Label>
                <Input type="text" name="title" disabled value={title} />
              </FormGroup>
            )}
            {(isQuizTake || isSubmited || isReviewed) && text ? (
              <CardTitle>{text.value}</CardTitle>
            ) : (
              <FormGroup>
                <Label for="question">Question</Label>
                <Input
                  type="text"
                  name="question"
                  disabled
                  value={text && text.value}
                />
              </FormGroup>
            )}
            {topic ? (
              <FormGroup>
                <Label for="topic">Topic</Label>
                <Input type="select" name="topic" disabled>
                  <option>{topic}</option>
                </Input>
              </FormGroup>
            ) : null}
            {questionType ? (
              <FormGroup>
                <Label for="questionType">Question type</Label>
                <Input type="select" name="questionType" disabled>
                  <option>{questionType}</option>
                </Input>
              </FormGroup>
            ) : null}
            <FormGroup tag="fieldset">
              <legend>Answers</legend>
              {answers
                ? answers.map(answer => {
                    const userAnswer =
                      userAnswers &&
                      userAnswers.find(x => x.predefinedAnswer === answer.id)
                        .userChoice
                    return (
                      <FormGroup key={answer.id}>
                        <AnswerComponent
                          checkboxName={answer.id}
                          isQuizTake={isQuizTake}
                          onChange={onChange}
                          correct={answer.correct}
                          userChoice={userAnswer}
                          value={answer.text.value}
                          isTextEnabled={!isQuizTake && !isPreview}
                          showAll={!!((!isTeacher && isReviewed) || isTeacher)}
                          isCheckboxEnabled={!isPreview}
                        />
                      </FormGroup>
                    )
                  })
                : null}
            </FormGroup>
            {score !== undefined &&
            (isTeacher || (!isTeacher && isReviewed)) ? (
              <FormGroup>
                <Label for="score">Score</Label>
                <Input
                  type="text"
                  name="score"
                  value={score}
                  onChange={onScore}
                  disabled={!isTeacher && isReviewed}
                />
              </FormGroup>
            ) : null}
            {comments
              ? comments.map(comment => {
                  return (
                    <ListGroupItem key={comment.id} color="warning">
                      <ListGroupItemHeading>
                        {comment.author.name}
                      </ListGroupItemHeading>
                      <ListGroupItemText>{comment.text}</ListGroupItemText>
                      <ListGroupItemText>
                        {new Date(comment.date).toLocaleDateString()}
                      </ListGroupItemText>
                    </ListGroupItem>
                  )
                })
              : null}
            {isQuizTake || isReviewed || isSubmited ? null : (
              <FormGroup color="warning">
                <InputGroup>
                  <Input
                    type="text"
                    name="newComment"
                    placeholder="Write a comment..."
                    onChange={this.changeHandler}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="warning"
                      onClick={() => onSendComment(id, this.state.newComment)}
                    >
                      Send
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            )}
            {isTeacher && !isSubmited && !isReviewed ? (
              <FormGroup color="success">
                <ButtonDropdown
                  isOpen={this.state.dropdownOpen}
                  toggle={this.toggle}
                >
                  <DropdownToggle caret color="success">
                    Approve as
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => this.onApprove(false)}>
                      Approve as public
                    </DropdownItem>
                    <DropdownItem onClick={() => this.onApprove(true)}>
                      Approve as private
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </FormGroup>
            ) : null}
          </CardBody>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {})(SavedQuestion)
