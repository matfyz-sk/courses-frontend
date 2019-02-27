import React, { Component } from 'react';
import { Collapse, CardBody, Card, CardHeader } from 'reactstrap';
import TaskView from './task';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[{id:1,title:'task 2',opened:true,currentTeam:0},{id:0,title:'task 1',opened:false,currentTeam:1}]
    }
  }

  render(){
    return(
      <div className="assignmentsContainer center-ver">
        {
          this.state.tasks.map((task,index)=>
          <Card>
            <CardHeader
              className="clickable"
              onClick={()=>{
                let newTasks=[...this.state.tasks];
                newTasks[index]={...newTasks[index],opened:!task.opened};
                this.setState({tasks:newTasks});
            }}>
              {task.title}
            </CardHeader>
            <Collapse isOpen={task.opened}>
              <CardBody>
                <TaskView task={task} history={this.props.history}/>
              </CardBody>
            </Collapse>
          </Card>

        )
        }
      </div>
    )
  }
}
