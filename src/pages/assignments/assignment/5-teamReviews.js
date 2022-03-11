import React, { Component } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { timestampToInput, unixToString } from 'helperFunctions';
import moment from 'moment';
import ErrorMessage from 'components/error';

export default class TeamReview extends Component {
  constructor(props) {
    super(props);
    this.setData.bind(this);
  }

  setData(parameter, value) {
    let newData = {...this.props.data};
    newData[parameter] = value;
    this.props.setData(newData);
  }

  render() {
    return (
      <div>
        <h3>Team review</h3>
        <div>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" checked={ this.props.data.disabled }
                     onChange={ () => this.setData('disabled', !this.props.data.disabled) }/> { ' ' }
              Disabled
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="submission-add-openTime">Open time</Label>
            <Button className="ml-2 mb-2 p-1" color="primary" disabled={ this.props.initialDeadline === null }
                    onClick={ () => {
                      this.setData('openTime', timestampToInput(this.props.initialDeadline))
                    } }><i className="fa fa-copy clickable"/>Copy initial deadline</Button>
            <Input id="submission-add-openTime" type="datetime-local" value={ this.props.data.openTime }
                   onChange={ (e) => {
                     this.setData('openTime', e.target.value)
                   } } disabled={ this.props.data.disabled }/>
          </FormGroup>
          <ErrorMessage show={ this.props.showErrors && !this.props.data.disabled && this.props.data.openTime === '' }
                        message="You must pick an open time!"/>
          <ErrorMessage
            show={ this.props.showErrors && this.props.data.openTime !== '' && this.props.initialDeadline !== null && this.props.initialDeadline > moment(this.props.data.openTime).unix() }
            message={ `Open time must be after intial submission deadline! (${ unixToString(this.props.initialDeadline) })` }/>

          <FormGroup>
            <Label htmlFor="submission-add-deadline">Deadline</Label>
            <Button className="ml-2 mb-2 p-1" color="primary" onClick={ () => {
              this.setData('deadline', this.props.data.openTime)
            } }><i className="fa fa-copy clickable"/>Copy open time</Button>
            <Input id="submission-add-deadline" type="datetime-local" value={ this.props.data.deadline }
                   onChange={ (e) => {
                     this.setData('deadline', e.target.value)
                   } } disabled={ this.props.data.disabled }/>
          </FormGroup>
          <ErrorMessage show={ this.props.showErrors && !this.props.data.disabled && this.props.data.deadline === '' }
                        message="You must pick the deadline!"/>
          <ErrorMessage
            show={ this.props.showErrors && !this.props.data.disabled && this.props.data.openTime !== '' && this.props.data.deadline !== '' && moment(this.props.data.openTime).unix() > moment(this.props.data.deadline).unix() }
            message="Open time is later than deadline!"/>

          <FormGroup>
            <Label htmlFor="submission-add-extraTime">Extra time (in minutes)</Label>
            <Input id="submission-add-extraTime" type="number" value={ this.props.data.extraTime } onChange={ (e) => {
              this.setData('extraTime', e.target.value)
            } } disabled={ this.props.data.disabled }/>
          </FormGroup>
          <ErrorMessage
            show={ this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.extraTime)) || parseInt(this.props.data.extraTime) < 0) }
            message="Extra time is not an number or negative!"/>
        </div>

      </div>
    )
  }
}
