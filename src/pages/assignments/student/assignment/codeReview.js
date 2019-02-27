import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import Select from 'react-select';

const bible=`Miusov, as a man man of breeding and deilcacy, could not but feel some inwrd qualms, when he reached the Father Superior's with Ivan: he felt ashamed of havin lost his temper. He felt that he ought to have disdaimed that despicable wretch, Fyodor Pavlovitch, too much to have been upset by him in Father Zossima's cell, and so to have forgotten himself. "Teh monks were not to blame, in any case," he reflceted, on the steps. "And if they're decent people here (and the Father Superior, I understand, is a nobleman) why not be friendly and courteous withthem? I won't argue, I'll fall in with everything, I'll win them by politness, and show them that I've nothing to do with that Aesop, thta buffoon, that Pierrot, and have merely been takken in over this affair, just as they have."

He determined to drop his litigation with the monastry, and relinguish his claims to the wood-cuting and fishery rihgts at once. He was the more ready to do this becuase the rights had becom much less valuable, and he had indeed the vaguest idea where the wood and river in quedtion were.
`

export default class CodeReview extends Component {
  constructor(props){
    super(props);
    this.state={
      file:{label:'./index.js',id:'./index.js'},
      openedComments:false
    }
  }

  render(){
    return(
      <div>
        <h3>Code review</h3>
        {
          [3,2,1].map((item)=>
            <div className="bottomSeparator">
              <h4>{'Review '+item}</h4>
              <div>
                <div className="row">
                  <h5>Jump to comment</h5>
                  <Button color="link" className="ml-auto"
                    onClick={()=>this.setState({openedComments:!this.state.openedComments})}
                    >
                    {this.state.openedComments?'Hide':'Show'}
                  </Button>
                </div>
                <Collapse isOpen={this.state.openedComments}>
                  <ListGroup>
                    <ListGroupItem action className="clickable">
                      Cras justo odio
                    </ListGroupItem>
                    <ListGroupItem action className="clickable">
                      Dapibus ac facilisis in
                    </ListGroupItem>
                    <ListGroupItem action className="clickable">
                      Morbi leo risus
                    </ListGroupItem>
                    <ListGroupItem action className="clickable">Porta ac consectetur ac</ListGroupItem>
                  </ListGroup>
                </Collapse>
              </div>
              <Select
                className="supressDefaultSelectStyle"
                value={this.state.file}
                onChange={(newData)=>this.setState({file:newData})}
                options={[{label:'./index.js',value:'./index.js'},{label:'./code.js',value:'./code.js'},{label:'./flux/store.js',value:'./flux/store.js'},{label:'./flux/data.js',value:'./flux/data.js'}]}
                />
              <div className="row">
                <div className="flex">
                  <h4>{'Submission v'+item}</h4>
                  <h5>CODE.js</h5>
                  <div className="codeBlock">
                    {bible}
                  </div>
                </div>
                <div className="flex">
                  <h4>{'Submission v'+(item-1)}</h4>
                  <h5>CODE.js</h5>
                  <div className="codeBlock">
                    {bible}
                  </div>
                </div>
              </div>
              <FormGroup>
                <Label className="bold">General comments</Label>
                <div>
                  Blablabla
                </div>
              </FormGroup>
            </div>
          )
        }
      </div>
    )
  }
}
