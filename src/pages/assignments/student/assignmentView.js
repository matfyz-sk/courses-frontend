import React, { Component } from 'react';
import { Collapse, CardBody, Card, CardHeader, Button } from 'reactstrap';

export default class AssignmentView extends Component{
  constructor(props){
    super(props);
    this.state={
      opened:this.props.task.opened
    }
  }

  render(){
    const assignmentURL='/assignments/'+(this.props.task.opened?"edit":"view")+'/'+this.props.task.id;
    return(
      <div className="assignmentViewContainer center-ver">
        <div className="row">
          <h3>{this.props.task.title}</h3>
        <Button color="link" className="ml-auto"
          onClick={()=>this.setState({opened:!this.state.opened})}
          >
          {this.state.opened?'Hide':'Show'}
        </Button>
        </div>
        <Collapse isOpen={this.state.opened}>
          <div>
            {this.props.task.description}
          </div>
          <Card>
            <CardBody>
              <h5>Your submission</h5>
              <div>
                <Button
                  onClick={()=>this.props.history.push(assignmentURL+'/0')}
                  color={this.props.task.opened?'success':undefined}
                  >
                  {this.props.task.opened?'Edit':'View'}
                </Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/1')}>Reviews</Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/2')}>Code reviews</Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/3')}>Team reviews</Button>{' '}
              </div>
              <h5>To review</h5>
              <div>
                <Button color="primary" onClick={()=>this.props.history.push('/assignments/view/3/0')}>Submission 1</Button>{' '}
                <Button color="primary" onClick={()=>this.props.history.push('/assignments/view/3/0')}>Submission 2</Button>{' '}
                <Button color="primary" onClick={()=>this.props.history.push('/assignments/view/3/0')}>Submission 3</Button>{' '}
              </div>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}
