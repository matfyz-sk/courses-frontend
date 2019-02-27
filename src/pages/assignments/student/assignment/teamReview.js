import React, { Component } from 'react';
import {Alert, CardBody, Card, CardHeader, Button, FormGroup, Label, Input, Collapse,ListGroup, ListGroupItem, FormText } from 'reactstrap';
import {randomSentence} from '../../../../helperFunctions';

const students=[{value:0,badgesGiven:10,percentageGiven:105,label:'Patricny'},{value:1,badgesGiven:7,percentageGiven:105,label:'Haradon'},{value:2,badgesGiven:0,percentageGiven:90,label:'Pestrak'}];

export default class TextTeview extends Component {
  constructor(props){
    super(props);
    this.state={
      openedToReview:true,
      openedOldReviews:false,
      openedReviews:true,

    }
  }

  render(){
    return(

      <div>
        <div>
          <div className="row">
            <h3>Team review</h3>
            <Button color="link" className="ml-auto"
              onClick={()=>this.setState({openedToReview:!this.state.openedToReview})}
              >
              {this.state.openedToReview?'Hide':'Show'}
            </Button>
          </div>
          <Collapse isOpen={this.state.openedToReview} className="bottomSeparator pb-3">
            <Alert color="danger">
              No team reviews open
            </Alert>
            <Alert color="success">
              Team reviews open
            </Alert>
            <div>
              {students.map((student)=>
                <div>
                <Label className="bold" for="teamName">{student.label}</Label>
                <FormGroup>
                  <Label for="teamName">Percentage</Label>
                  <Input type="number" placeholder="Enter how many percents" />
                </FormGroup>
                <FormGroup>
                  <Label for="teamName">Private comment for the teacher</Label>
                  <Input type="textarea" placeholder="Enter voluntary comment about the stundent for this round" />
                </FormGroup>
              </div>
            )}
            <FormText color="muted">
              Students score will be based on max. points that will be distributed accordingly between all students.
            </FormText>
            <FormText color="muted">
              Example, if one student will have 50% and another 100%, student one will get third of the points while the other the rest.
              If left empty every student will get the same points.
            </FormText>
            <Button color="primary">Submit team review</Button>
            </div>
          </Collapse>
        </div>

        <div>
          <div className="row">
            <h3>Given team review</h3>
              <Button color="link" className="ml-auto"
              onClick={()=>this.setState({openedOldReviews:!this.state.openedOldReviews})}
              >
              {this.state.openedOldReviews?'Hide':'Show'}
            </Button>
          </div>
          <Collapse isOpen={this.state.openedOldReviews} className="bottomSeparator pb-3">
          {
            [3,2,1].map((round)=>
            <div>
              <h5>Team review {round}</h5>
            <ListGroup>
              {
                students.map((item)=>
                <ListGroupItem action>
                  <div>
                    <div>
                      <Label className="bold mr-2">Teammate:</Label>{item.label}
                    </div>
                    <div>
                      <Label className="bold mr-2">Badges given:</Label>{item.badgesGiven}
                    </div>
                    <div>
                      <Label className="bold mr-2">Percentage given:</Label>{item.percentageGiven}
                    </div>
                  </div>
                </ListGroupItem>
              )}
            </ListGroup>
          </div>
          )}
        </Collapse>
        </div>

        <div>
          <div className="row">
            <h3>Your review</h3>
            <Button color="link" className="ml-auto"
              onClick={()=>this.setState({openedReviews:!this.state.openedReviews})}
              >
              {this.state.openedReviews?'Hide':'Show'}
            </Button>
          </div>
          <Collapse isOpen={this.state.openedReviews} className="bottomSeparator pb-3">
            <div>
              <div>
                <ListGroup>
                  <ListGroupItem action>
                    Points gained: 10/10
                  </ListGroupItem>
                  <ListGroupItem action>
                    Points gained: 5/10
                  </ListGroupItem>
                  <ListGroupItem action>
                    Points gained: 9/10
                  </ListGroupItem>
                </ListGroup>
              </div>

              <div className="row">
                {
                  [0,1,2,3,4,5,6,7,8,9].map((image,index)=>
                  <Card key={index} body style={{maxWidth:150,minWidth:150,marginRight:5,padding:0}}>
                    <CardBody style={{padding:0}}>
                      <div className="gallery-cat-image-container" style={{marginLeft:'auto',marginRight:'auto'}}>
                        <img
                          className="gallery-cat-image"
                          src={'https://www.furrici.info/data/avatar/therian.jpg'}
                          alt={'https://www.furrici.info/data/avatar/therian.jpg'}
                          />
                      </div>
                    </CardBody>
                  </Card>)
                }
              </div>
            </div>
          </Collapse>
        </div>

      </div>
    )
  }
}
