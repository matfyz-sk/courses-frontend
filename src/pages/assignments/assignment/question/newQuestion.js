import React, { Component } from 'react';
import { Alert, Button, FormGroup, Input, Label } from 'reactstrap';
import ErrorMessage from 'components/error';

export default class AddQuestion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      question: '',
      rated: false,
      showErrors: false
    }
  }

  addQuestion() {
    this.setState({showErrors: false})
    if(this.state.question.length <= 4) {
      this.setState({showErrors: true});
      return;
    }
    let question = {
      question: this.state.question,
      rated: this.state.rated,
    }
    this.props.addQuestion(question);
    this.setState({question: '', rated: false})
  }

  render() {
    return (
      <div>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={ this.state.rated }
                   onChange={ (e) => this.setState({rated: !this.state.rated}) }/>
            { ' ' } Rated
          </Label>
        </FormGroup>
        <FormGroup>
          <Label for="new-question-text">Question</Label>
          <Input type="textarea" id="new-question-text" value={ this.state.question }
                 onChange={ (e) => this.setState({question: e.target.value}) }/>
          <ErrorMessage show={ this.state.question.length <= 4 && this.state.showErrors }
                        message="Question should be at least 5 characters!"/>
        </FormGroup>
        <Alert color="info" className="small-alert">
          Only questions that were assigned to the assignment will be saved!
        </Alert>
        <Button outline size="sm" className="m-2 m-r-285" color="secondary" onClick={ this.props.closePopover }>
          Close
        </Button>
        <Button size="sm" className="m-2" color="success" onClick={ this.addQuestion.bind(this) }>
          <i className="fa fa-plus clickable"/>
          Add question
        </Button>
      </div>
    )
  }
}
