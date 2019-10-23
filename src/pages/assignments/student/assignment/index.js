import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody,TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Submission from './submission';
import CodeReview from './codeReview';
import Reviews from './reviews';
import TeamReview from './teamReview';
import {submissions} from './data';

export default class Assignment extends Component{
  constructor(props){
    super(props);
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
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 3, clickable:true })}
                  onClick={() =>{ this.setState({tab:3});this.props.history.push(tabURL+3)}}
                  >
                  Team review
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
              <TabPane tabId={3}>
                <TeamReview history={this.props.history} match={this.props.match} />
              </TabPane>
            </TabContent>


          </CardBody>
        </Card>
      </div>
    )
  }
}
