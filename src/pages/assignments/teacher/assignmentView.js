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
              <h5>Submissions</h5>
              <div>
                <Button onClick={()=>this.props.history.push(assignmentURL+'/0')} color='success'>Edit</Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/1')}>View submissions</Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/2')}>View code reviews</Button>{' '}
                <Button onClick={()=>this.props.history.push(assignmentURL+'/3')}>View team reviews</Button>{' '}
              </div>
              <h5>Reviews</h5>
              <div>
                <Button color="primary" onClick={()=>this.props.history.push('/assignments/view/3/0')}>Submission 1</Button>
              </div>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}
