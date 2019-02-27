import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input } from 'reactstrap';

export default class TextTeview extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    return(
      <Card>
        <CardHeader>
          Text review
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label for="q1">Question 1</Label>
            <Input type="textarea" name="text" id="q1" />
          </FormGroup>
          <FormGroup>
            <Label for="q2">Question 2</Label>
            <Input type="textarea" name="text" id="q2" />
          </FormGroup>
        </CardBody>
      </Card>
    )
  }
}
