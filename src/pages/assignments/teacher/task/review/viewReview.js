import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import CodeReview from './codeReview';
import TextReview from './textReview';

const reviews = [
  {id:2,title:'Review 3',active:true, deadline:1604047500,body:'AAH' },
  {id:1,title:'Review 2',active:false, deadline:1549788300, body:'BBB' },
  {id:0,title:'Review 1',active:false, deadline:1547109900, body:'CCC' },
]

export default class ViewSubmission extends Component{
  constructor(props){
    super(props);
    this.state={
      tab:0,
      open:false,
      review:reviews.find((item)=>item.id===this.props.id)
    }
  }

  toggle(){
    this.setState({open:!this.state.open})
  }

  render(){
    return(
      <div>
        {
          this.state.review.active?
          <Button color="success" onClick={this.toggle.bind(this)}>Edit</Button>
          :
          <Button color="primary" onClick={this.toggle.bind(this)}>View</Button>
        }
        <Modal isOpen={this.state.open} className="modal-customs-full">
          <ModalHeader toggle={this.toggle.bind(this)}>{this.state.review.active?'Editing':'Viewing'} review</ModalHeader>
          <ModalBody>
            <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.tab === 0, clickable:true })}
                onClick={() => this.setState({tab:0})}
              >
                General review
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.tab === 1, clickable:true })}
                onClick={() => this.setState({tab:1})}
              >
                Code review
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={this.state.tab}>
            <TabPane tabId={0}>
              <TextReview />
            </TabPane>
            <TabPane tabId={1}>
              <CodeReview review={this.state.review} />
            </TabPane>
          </TabContent>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
