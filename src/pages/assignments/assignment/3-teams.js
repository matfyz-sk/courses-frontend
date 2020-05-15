import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import ErrorMessage from 'components/error';

export default class Teams extends Component {
  constructor(props){
    super(props);
    this.setData.bind(this);
  }

  setData(parameter,value){
    let newData={...this.props.data};
    newData[parameter]=value;
    this.props.setData(newData);
  }

  render(){
    return(
      <div>
        <h3>Teams</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={this.props.data.disabled} onChange={()=>this.props.setTeamsDisabled(!this.props.data.disabled)} /> {' '}
            Disabled
          </Label>
        </FormGroup>

        <div className="row">
          <FormGroup tag="fieldset">
            <Label style={{paddingRight:5}}>Tasks submited as:</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" checked={this.props.data.submittedAsTeam} value={true} onChange={()=>{this.setData('submittedAsTeam',true)}} name="type" disabled={this.props.data.disabled}/>{' '}
                Team
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" checked={!this.props.data.submittedAsTeam} value={false} onChange={()=>{this.setData('submittedAsTeam',false)}} name="type" disabled={this.props.data.disabled}/>{' '}
                Individual
              </Label>
            </FormGroup>
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="submission-add-minimumInTeam">Size of a team min</Label>
          <Input id="submission-add-minimumInTeam" type="number" value={this.props.data.minimumInTeam} onChange={(e)=>this.setData('minimumInTeam',e.target.value)} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.minimumInTeam)) || parseInt(this.props.data.minimumInTeam) < 2)} message="Teams must be at least of size 2!" />
        <FormGroup>
          <Label htmlFor="submission-add-maximumInTeam">Size of a team max</Label>
          <Input id="submission-add-maximumInTeam" type="number" value={this.props.data.maximumInTeam} onChange={(e)=>this.setData('maximumInTeam',e.target.value)} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.minimumInTeam)) || isNaN(parseInt(this.props.data.maximumInTeam)) || parseInt(this.props.data.minimumInTeam) > parseInt(this.props.data.maximumInTeam) )} message="Mimimum is higher than maximum of team members or one of them is not a number." />

        <FormGroup check>
        <Label check>
          <Input type="checkbox" checked={this.props.data.multipleSubmissions} onChange={()=>this.setData('multipleSubmissions',!this.props.data.multipleSubmissions)} disabled={this.props.data.disabled}/> {' '}
          Multiple submissions
        </Label>
      </FormGroup>
        </div>

      </div>
    )
  }
}
