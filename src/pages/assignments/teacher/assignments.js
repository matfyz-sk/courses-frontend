import React, { Component } from 'react';
import { Collapse, CardBody, Card, CardHeader, Button, Label, Input, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import TaskView from './task';

const filtering= [
  {value:'All',label:'All'},
  {value:'Submissions',label:'Submissions'},
  {value:'Reviews',label:'Reviews'},
]

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[{id:1,title:'task 2',opened:true,currentTeam:0},{id:0,title:'task 1',opened:false,currentTeam:1}],
      selectedFilter:filtering[0]
    }
  }

  render(){
    return(
      <div className="assignmentsContainer center-ver">
        <Button color="success">Add</Button>
        <div className="row">
          <InputGroup style={{flex:1}}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon
                  icon="search"
                  />
              </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="username" />
          </InputGroup>
          <div style={{width:150}}>
          <Select
            options={filtering}
            value={this.state.selectedFilter}
            onChange={e =>{ this.setState({ selectedFilter: e }); }}
            />
        </div>
          <Button color="primary">Search</Button>
        </div>
        TODO LIST
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
                <TaskView task={task} />
              </CardBody>
            </Collapse>
          </Card>

        )
      }
    </div>
  )
}
}
