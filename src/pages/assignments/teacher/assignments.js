import React, { Component } from 'react';
import AssignmentView from './assignmentView';
import AddAssignment from './addAssignment';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[
        {id:0,title:'Assignmnent 1',description:'Short description of assignment',deadline:'13.11.2019 23:59',opened:true,submitted:false},
        {id:1,title:'Assignmnent 2',description:'Short description of assignment',deadline:'22.12.2019 23:59',opened:true,submitted:true,submissions:[{date:'1.12.2019 22:00',title:'Submission 1'}]},
        {id:2,title:'Assignmnent 3',description:'Short description of assignment',deadline:'1.1.2019 23:59',opened:false,submitted:true,submissions:[{date:'24.12.2018 21:00',title:'Submission 1'},{date:'24.12.2018 21:45',title:'Submission 2'}]},
      ]
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
