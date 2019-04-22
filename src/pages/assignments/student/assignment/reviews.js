import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, Collapse } from 'reactstrap';
import {randomSentence} from '../../../../helperFunctions';
export default class TextTeview extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  render(){
    return(

      <div>
        <div>
          {
            [1,2,3,4].map((question)=>
            <div className="bottomSeparator">
              <Label className="bold">Question {question}</Label>
              {
                [1,2,3].map((answer)=>
                <div className="row">
                  <label className="bolder italic">
                    Answer {answer}:
                  </label>
                  <div>
                    {randomSentence()}
                  </div>
              </div>
            )}
          </div>
        )}
        <div>
          <h4>Teachers review</h4>
          <div>
            {randomSentence()}
          </div>
        </div>
      </div>
    </div>
  )
}
}
