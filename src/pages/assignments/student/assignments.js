import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import AssignmentView from './assignmentView';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[{id:1,title:'Assignmnent 2',description:'Short description of assignment',opened:true,currentTeam:0},{id:0,title:'Assignmnent 1',description:'Short description of assignment',opened:false,currentTeam:1}]
    }
  }

  render(){
    return(
      <div className="assignmentsContainer center-ver">
        <h1>
          Assignments
        </h1>
        {
          this.state.tasks.map((task,index)=> <AssignmentView task={task} history={this.props.history}/>)
        }
      </div>
    )
  }
}
