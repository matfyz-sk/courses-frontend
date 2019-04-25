import React, { Component } from 'react';
import { Collapse, CardBody, Card, CardHeader, Button, Alert, Table } from 'reactstrap';

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
          <Card>
            <CardBody>
              <div>
                {this.props.task.description}
              </div>
              {this.props.task.opened &&
                <div>
                  <div  className="row mb-1">
                    <h5 className="mb-0">Deadline:</h5><span> {this.props.task.deadline}</span>
                  </div>
                  { !this.props.task.submitted &&
                    <div>
                      <Alert color="warning">
                        No submissions yet!
                      </Alert>
                      <Button color="primary" onClick={()=>this.props.history.push(assignmentURL+'/0')}>Submit</Button>
                    </div>
                  }
                  {
                    this.props.task.submitted &&
                    <div>
                      <h5>Your submissions</h5>
                      <Table>
                        {false && <thead>
                          <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>
                            </th>
                          </tr>
                        </thead>}
                        <tbody>
                          {this.props.task.submissions.map((submission)=>
                            <tr>
                              <td>
                                {submission.date}
                              </td>
                              <td>
                                {submission.title}
                              </td>
                              <td>
                                <Button color="success" onClick={()=>this.props.history.push(assignmentURL+'/0')}>Update</Button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      <Button color="primary" onClick={()=>this.props.history.push(assignmentURL+'/0')}>Submit another</Button>
                    </div>
                  }
                </div>
              }
              {
                !this.props.task.opened &&
                <div>
                  <h5>Your submissions</h5>
                    <Table>
                      {false && <thead>
                        <tr>
                          <th>Date</th>
                          <th>Title</th>
                          <th>
                          </th>
                        </tr>
                      </thead>}
                      <tbody>
                        {this.props.task.submissions.map((submission,index)=>
                          <tr>
                            <td>
                              {submission.date}
                            </td>
                            <td>
                              {submission.title}
                            </td>
                            <td>
                              <Button color="success" onClick={()=>this.props.history.push(assignmentURL+'/0')}>View</Button>
                              <Button color="primary" onClick={()=>this.props.history.push(assignmentURL+'/3')}>{index%2===0?'Review team':'View team review'}</Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                  <h5>Submissions to review</h5>
                    <Table>
                      {false && <thead>
                        <tr>
                          <th>Date</th>
                          <th>Title</th>
                          <th>
                          </th>
                        </tr>
                      </thead>}
                      <tbody>
                        {this.props.task.submissions.map((submission, index)=>
                          <tr>
                            <td>
                              {submission.date}
                            </td>
                            <td>
                              Team {index}
                            </td>
                            <td>
                              <Button color="primary" onClick={()=>this.props.history.push('/assignments/review/3/0')}>{index%2===0?'Review':'Update/Show review'}</Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  <div>
                  </div>
                </div>
              }
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}
