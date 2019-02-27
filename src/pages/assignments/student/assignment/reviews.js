import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, Collapse } from 'reactstrap';
import {randomSentence} from '../../../../helperFunctions';
export default class TextTeview extends Component {
  constructor(props){
    super(props);
    this.state={
      opened:[true,false,false]
    }
  }

  render(){
    return(

      <div>
        {
          this.state.opened.map((opened,index)=>
            <div>
              <div className="row">
                <h3>Review {index+1}</h3>
                <Button color="link" className="ml-auto"
                  onClick={()=>{
                    let newOpened=[...this.state.opened];
                    newOpened.splice(index,1,!opened);
                    this.setState({opened:newOpened});
                  }}
                  >
                  {opened?'Hide':'Show'}
                </Button>
              </div>
              <Collapse isOpen={opened}>
                {
                  [1,2,3,4].map((question)=>
                  <div className="bottomSeparator">
                    <Label className="bold">Question {question}</Label>
                    {
                      [1,2,3].map((answer)=>
                      <div>
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
              </Collapse>
            </div>
          )
        }
    </div>
    )
  }
}
