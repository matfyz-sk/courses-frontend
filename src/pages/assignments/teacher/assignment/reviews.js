import React, { Component } from 'react';
import { Label } from 'reactstrap';
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
            <div className="bottomSeparator" key={question}>
              <Label className="bold">Question {question}</Label>
              {
                [1,2,3].map((answer)=>
                <div className="row" key={answer}>
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
