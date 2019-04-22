import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody,TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import classnames from 'classnames';
import {timestampToString} from '../../../../helperFunctions';

import Submission from './submission';
import CodeReview from './codeReview';
import Reviews from './reviews';

const submissions = [
  {id:2,title:'Assignment 2',active:true, deadline:1549788300, body:'BBB this will be full body of assignment', description:'Short description of assignment'},
  {id:3,title:'Assignment 1',active:false, deadline:1547109900, body:'CCC this will be full body of assignment',description:'Short description of assignment' },
]

const teams = [
  {value:0,label:'Jarovice',members:[{id:1,name:'Jaroslav',surname:'Matejovic'},{id:2,name:'Jaroslav',surname:'Biely'},{id:0,name:'Juraj',surname:'Macek'}]},
  {value:1,label:'Failures',members:[{id:4,name:'Barbora',surname:'Severna'},{id:5,name:'Martin',surname:'Juzny'},{id:0,name:'Juraj',surname:'Macek'}]}
]

const selectStyle = {
  control: base => ({
    ...base,
    minWidth: 250,
  })
};

export default class Assignment extends Component{
  constructor(props){
    super(props);
    console.log(this.props.match.params.id);
    this.state={
      submission:submissions.find((item)=>item.id===parseInt(this.props.match.params.id)),
      tab:parseInt(this.props.match.params.tabID)
    }
  }

  componentWillReceiveProps(props){
    if(props.match.params.tabID!==this.props.match.params.tabID){
      this.setState({tab:parseInt(props.match.params.tabID)})
    }
  }

  render(){
    const tabURL='/assignments/'+(this.state.submission.active?'edit/':'view/')+this.props.match.params.id+'/';
    return(
      <div className="assignmentContainer center-ver">
        <Card className="assignmentsContainer center-ver">
          <CardHeader className="row">
            <Button size="sm" color="" onClick={()=>this.props.history.goBack()}>
              <FontAwesomeIcon
                icon="arrow-left"
                className="clickable center-hor"
                />
            </Button>
            <h4 className="center-hor ml-5">
              {this.state.submission.title}
            </h4>
          </CardHeader>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 0, clickable:true })}
                  onClick={() =>{ this.setState({tab:0});this.props.history.push(tabURL+0)}}
                  >
                  Submissions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 1, clickable:true })}
                  onClick={() =>{ this.setState({tab:1});this.props.history.push(tabURL+1)}}
                  >
                  Reviews
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 2, clickable:true })}
                  onClick={() =>{ this.setState({tab:2});this.props.history.push(tabURL+2)}}
                  >
                  Code reviews
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.tab}>
              <TabPane tabId={0}>
                <Submission history={this.props.history} match={this.props.match} />
              </TabPane>
              <TabPane tabId={1}>
                <Reviews history={this.props.history} match={this.props.match} />
              </TabPane>
              <TabPane tabId={2}>
                <CodeReview history={this.props.history} match={this.props.match} />
              </TabPane>
            </TabContent>


          </CardBody>
        </Card>
      </div>
    )
  }
}
