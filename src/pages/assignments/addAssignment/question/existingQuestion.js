import React, { Component } from 'react';
import { Label, Input, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Table } from 'reactstrap';
import { Alert } from 'reactstrap';
import ErrorMessage from '../../../../components/error';

export default class AddQuestion extends Component{

  constructor(props){
    super(props);
    this.state = {
      filter: '',
    }
  }

  render(){
    let selectedQuestionsIDs = this.props.selectedQuestions.map( (question) => question['@id'] );
    return(
      <div className="scrollable">
        <Alert color="info" className="small-alert">
          Only questions that were assigned to the assignment will be saved!
        </Alert>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText><i className="fa fa-search flip" /></InputGroupText>
          </InputGroupAddon>
          <input
            type="text"
            className="form-control search-text"
            value={this.state.filter}
            onChange={(e)=>this.setState({filter: e.target.value})}
            placeholder="Search"
          />
        </InputGroup>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th width="25">Rated</th>
              <th width="75">Is new</th>
              <th width="20"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.allQuestions.filter(
              (question) =>
              !selectedQuestionsIDs.includes(question['@id']) &&
              question.question.toLowerCase().includes(this.state.filter.toLowerCase())
            ).map((question)=>
              <tr key={question['@id']}>
                <td>{ question.question }</td>
                <td style={{ textAlign: 'center' }}>{ question.rated ? <i className="fa fa-check green-color" /> : <i className="fa fa-times light-red-color" /> }</td>
                <td style={{ textAlign: 'center' }}>{ question.new ? <i className="fa fa-check green-color" /> : <i className="fa fa-times light-red-color" /> }</td>
                <td>
                  <Button outline size="sm" color="success" className="center-ver" onClick={()=>this.props.addQuestion(question)}>
                    Add
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Button outline size="sm" className="m-2" color="secondary" onClick={ this.props.closePopover }>
          Close
        </Button>
      </div>
    )
  }
}
