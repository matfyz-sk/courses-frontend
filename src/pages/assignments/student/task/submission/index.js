import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Table, Button } from 'reactstrap';
import {timestampToString} from '../../../../../helperFunctions';
import ViewReview from './viewSubmission';

const reviews = [
  {id:0,title:'Team 1',active:false, deadline:1547109900, body:'CCC' },
  {id:1,title:'Team 2',active:false, deadline:1547109900, body:'BBB' },
  {id:2,title:'Team 3',active:true, deadline:1547109900,body:'AAH' },
]

const points = [
  {id:2,submission:'Round 3 - submission',rated:false, maxPoints:10, minPoints:6},
  {id:1,submission:'Round 2 - submission',rated:true, points:5, maxPoints:10, minPoints:6},
  {id:0,submission:'Round 1 - submission',rated:true, points:3, maxPoints:10, minPoints:2},
]


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
      <div>
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
                <th>Reviews</th>
                <th>Actions</th>
                <th>Points</th>
                <th>Minimum</th>
                <th>Maximum</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.submissions.map((item,index)=>
                <tr>
                  <td>{item.title}</td>
                  <td>{timestampToString(item.deadline)}</td>
                    <td>
                      <Button color="primary" onClick={()=>this.props.history.push('/assignments/reviews/'+item.id)}>Reviews</Button>
                    </td>
                  <td>
                    {
                      item.active?
                      <Button color="success" onClick={()=>this.props.history.push('/assignments/edit/'+item.id)}>Edit</Button>
                      :
                      <Button color="primary" onClick={()=>this.props.history.push('/assignments/view/'+item.id)}>View</Button>
                    }
                  </td>
                  <td>{points[index].rated?points[index].points:""}</td>
                  <td>{points[index].minPoints}</td>
                  <td>{points[index].maxPoints}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
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
                reviews.map((item)=>
                <tr>
                  <td>{item.title}</td>
                  <td>{timestampToString(item.deadline)}</td>
                    <td>
                      <Button color="primary" onClick={()=>this.props.history.push('/assignments/reviews/'+item.id)}>View old</Button>
                    </td>
                    <td>
                      {
                        item.active?
                        <Button color="primary" onClick={()=>this.props.history.push('/assignments/reviews/'+item.id)}>Review</Button>
                        :
                        <Button color="primary" onClick={()=>this.props.history.push('/assignments/reviews/'+item.id)}>Edit review</Button>
                      }
                    </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
    )
  }
}
