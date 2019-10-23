import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, NavItem, NavLink, Nav, TabContent, TabPane } from 'reactstrap';
import Info from './info';
import classnames from 'classnames';

import PeerReview from './peerReview';
import Teams from './teams';
import Reviews from './reviews';
import TeamReviews from './teamReviews';
import Attributes from './attributes';

export default class ModalAdd extends Component {
  constructor(props){
    super(props);
    this.state={
      activeTab:'1',
      opened:false,
      info:{
        name:'',
        description:'',
        documents:[{id:1,name:'Document 1',url:'https://www.google.com/search?q=semantika'},{id:2,name:'Document 2',url:'https://www.google.com/search?q=matematika'},{id:3,name:'Document 3',url:'https://www.google.com/search?q=logika'}]
      },
      attributes:{
        attributes:[
          {id:0,title:'Nazov riesenia',description:'Nazvy riesenie',type:{label:'input',value:'input'},isTitle:false},
          {id:1,title:'Popis riesenia',description:'Popis riesenie',type:{label:'text area',value:'text area'},isTitle:false},
        ]
      }
    }
    this.toggle.bind(this);
  }

  toggle(){
    this.setState({opened:!this.state.opened})
  }

  setDefaults(){
    if(window.confirm('Are you sure you want to reset all assignment settings?')){
      this.setState({
        info:{
          name:'',
          description:'',
          documents:[{id:1,name:'Document 1',url:'https://www.google.com/search?q=semantika'},{id:2,name:'Document 2',url:'https://www.google.com/search?q=matematika'},{id:3,name:'Document 3',url:'https://www.google.com/search?q=logika'}]
        },
        attributes:{
          attributes:[
            {id:0,title:'Nazov riesenia',description:'Nazvy riesenie',type:{label:'input',value:'input'},isTitle:false},
            {id:1,title:'Popis riesenia',description:'Popis riesenie',type:{label:'text area',value:'text area'},isTitle:false},
          ]
        }
      })
    }
  }

  render(){
    return(
      <div>
        <Button color="primary" onClick={this.toggle.bind(this)}>Add assignment</Button>
        <Modal isOpen={this.state.opened} className={this.props.className} style={{width:'auto',maxWidth:1000}}>
          <ModalHeader toggle={this.toggle.bind(this)}>
            Adding new assignment
          </ModalHeader>
          <ModalBody>
            <Nav tabs className="b-0">
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'1'}) }}
                >
                  Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'2'}) }}
                >
                  Attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'3'}) }}
                >
                  Peer Review
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'4'}) }}
                >
                  Teams
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '5'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'5'}) }}
                >
                  Reviews
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '6'}, "clickable")}
                  onClick={() => { this.setState({activeTab:'6'}) }}
                >
                  Team Reviews
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Info data={this.state.info} setData={(info)=>{this.setState({info})}} />
              </TabPane>
              <TabPane tabId="2">
                <Attributes data={this.state.attributes} setData={(attributes)=>{this.setState({attributes})}} />
              </TabPane>
              <TabPane tabId="3">
                <PeerReview />
              </TabPane>
              <TabPane tabId="4">
                <Teams />
              </TabPane>
              <TabPane tabId="5">
                <Reviews />
              </TabPane>
              <TabPane tabId="6">
                <TeamReviews />
              </TabPane>
            </TabContent>
          </ModalBody>
          <ModalFooter>
            <span className="mr-auto">
              <Button outline color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
            </span>
            <span>
              <Button color="danger" onClick={this.setDefaults.bind(this)}>Reset</Button>
              <Button color="secondary" disabled={this.state.activeTab==="1"} onClick={()=>this.setState({activeTab:(parseInt(this.state.activeTab)-1)+""})}>Prev</Button>{' '}
              <Button color="primary" onClick={()=>{
                  if(this.state.activeTab!=="6"){
                    this.setState({activeTab:(parseInt(this.state.activeTab)+1)+""});
                  }else{
                    this.toggle();
                  }
              }}>{this.state.activeTab==="6"?'Add':'Next'}</Button>{' '}
            </span>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
