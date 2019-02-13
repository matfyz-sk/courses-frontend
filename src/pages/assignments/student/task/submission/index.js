import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Table } from 'reactstrap';
import {timestampToString} from '../../../../../helperFunctions';
import ViewReview from './viewSubmission';

export default class Reviews extends Component{
  constructor(props){
    super(props);
    this.state={
      submissions:[
        {id:2,title:'Submission 3',active:true, deadline:1604047500 },
        {id:1,title:'Submission 2',active:false, deadline:1549788300 },
        {id:0,title:'Submission 1',active:false, deadline:1547109900 },
      ]
    }
  }

  render(){
    return(
      <Card>
        <CardHeader>
          Your submissions
        </CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.submissions.map((item)=>
                <tr>
                  <td>{item.title}</td>
                  <td>{timestampToString(item.deadline)}</td>
                  <td>
                    <ViewReview id={item.id} />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )
  }
}
