import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Table } from 'reactstrap';

export default class Score extends Component{
  constructor(props){
    super(props);
    this.state={
      ratings:[
        {id:2,submission:'Round 3 - submission',rated:false, maxPoints:10, minPoints:6},
        {id:1,submission:'Round 2 - submission',rated:true, points:5, maxPoints:10, minPoints:6},
        {id:0,submission:'Round 1 - submission',rated:true, points:3, maxPoints:10, minPoints:2},
      ]
    }
  }

  render(){
    return(
        <Card>
          <CardHeader>
            Students points
          </CardHeader>
          <CardBody>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Points</th>
                <th>Minimum</th>
                <th>Maximum</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.ratings.map((item)=>
                <tr>
                  <th scope="row">{item.id}</th>
                  <td>{item.submission}</td>
                  <td>{item.rated?item.points:""}</td>
                  <td>{item.minPoints}</td>
                  <td>{item.maxPoints}</td>
                </tr>
              )}
            </tbody>
          </Table>
          </CardBody>
        </Card>
    )
  }
}
