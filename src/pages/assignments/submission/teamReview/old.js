import React, { Component } from 'react';
import { CardBody, Card, Button, FormGroup, Label, Input, Collapse,ListGroup, ListGroupItem, FormText } from 'reactstrap';


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

  /*
  nacitat clenov teamu
  nacitat hodnotenia od teamu ak skoncil cas

  otvorit formular ak prebieha hodnotenie
  ak student nezanechal review nechat komentar a 100
  zobrazit review - pocet bodov/pocet clenov zaokruhlit

  ak ucitel vypis studentov a ich hodnoteni a od koho

  ak je initial tak ulozit k nemu, ak nie je initial tak extended ak ziadne nie je napisat ze team sa neda hodnotit
  */

  render(){
    return(
      <div>
      </div>
    )
    return(
      <div>
        <div>
            <div>
            <FormText color="muted">
              Students score will be based on max. points that will be distributed accordingly between all students.
            </FormText>
            <FormText color="muted">
              Example, if one student will have 50% and another 100%, student one will get third of the points while the other the rest.
              If left empty every student will get the same points.
            </FormText>
            <Button color="primary">Submit team review</Button>
            </div>
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
              <h5>Team review</h5>
            <ListGroup>
              {
                students.map((item)=>
                <ListGroupItem action key={item.value}>
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
                  <ListGroupItem>
                    Points gained: 10/10
                  </ListGroupItem>
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
