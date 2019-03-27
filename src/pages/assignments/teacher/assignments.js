import React, { Component } from 'react';
import { Collapse,Button } from 'reactstrap';
import AssignmentView from './assignmentView';
import AddAssignment from './assignment/addAssignment';

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
        <div>
          <Button color="success" className="ml-auto"
            onClick={()=>this.setState({addOpen:!this.state.addOpen})}
            >
            Add assignment
          </Button>
          <Collapse isOpen={this.state.addOpen}>
            <AddAssignment/>
            <Button color="" className="ml-auto"
              onClick={()=>this.setState({addOpen:!this.state.addOpen})}
              >
              Close
            </Button>
          </Collapse>
        </div>
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
