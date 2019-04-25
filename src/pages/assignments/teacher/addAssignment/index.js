import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RichTextEditor from "react-rte";
import Select from 'react-select';
import Info from './info';

import PeerReview from './peerReview';
import Teams from './teams';
import Reviews from './reviews';
import TeamReviews from './teamReviews';
import Attributes from './attributes';

export default class ModalAdd extends Component {
  constructor(props){
    super(props);
    this.state={
      index:0,
      opened:false
    }
    this.toggle.bind(this);
  }

  toggle(){
    this.setState({opened:!this.state.opened})
  }

  render(){
    return(
      <div>
        <Button color="primary" onClick={this.toggle.bind(this)}>Add assignment</Button>
        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} className={this.props.className} style={{width:'auto',maxWidth:1000}}>
          <ModalHeader toggle={this.toggle.bind(this)}>Adding new assignment</ModalHeader>
          <ModalBody>
              {
                this.state.index===0 && <Info />
              }
              {
                this.state.index===1 && <Attributes />
              }
              {
                this.state.index===2 && <PeerReview />
              }
              {
                this.state.index===3 && <Teams />
              }
              {
                this.state.index===4 && <Reviews />
              }
              {
                this.state.index===5 && <TeamReviews />
              }
          </ModalBody>
          <ModalFooter>
            <span className="mr-auto">
              <Button outline color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
            </span>
            <span>
              <Button color="secondary" disabled={this.state.index===0} onClick={()=>this.setState({index:this.state.index-1})}>Prev</Button>{' '}
              <Button color="primary" onClick={()=>{
                  if(this.state.index!==5){
                    this.setState({index:this.state.index+1});
                  }else{
                    this.toggle();
                  }
              }}>{this.state.index===5?'Add':'Next'}</Button>{' '}
            </span>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
