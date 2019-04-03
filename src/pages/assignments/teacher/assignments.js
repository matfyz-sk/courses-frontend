import React, { Component } from 'react';
import { Collapse,Button } from 'reactstrap';
import AssignmentView from './assignmentView';
import AddAssignment from './addAssignment';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[{id:1,title:'Assignmnent 2',description:'Short description of assignment',opened:true},{id:0,title:'Assignmnent 1',description:'Short description of assignment',opened:false}],
      addOpen:false
    }
  }

  render(){
    return(
      <div className="assignmentsContainer center-ver">
        <AddAssignment/>
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
