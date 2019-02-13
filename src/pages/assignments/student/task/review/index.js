import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Table } from 'reactstrap';
import {timestampToString} from '../../../../../helperFunctions';
import ViewReview from './viewReview';
export default class Reviews extends Component {
  constructor(props){
    super(props);
    this.state={
      review:[
        {id:2,title:'Review 3',active:true, deadline:1604047500 },
        {id:1,title:'Review 2',active:false, deadline:1549788300 },
        {id:0,title:'Review 1',active:false, deadline:1547109900 },
      ]
    }
  }

  render(){
    return(
      <Card>
        <CardHeader>
          Your reviews
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
                this.state.review.map((item)=>
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
