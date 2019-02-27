import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Team from './team';
import Score from './score';
import Reviews from './review';
import Submissions from './submission';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      tab:0
    }
  }

  render(){
    return(<Submissions history={this.props.history} />);
    return(
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.tab === 0, clickable:true })}
              onClick={() => this.setState({tab:0})}
            >
              Overview
            </NavLink>
          </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 1, clickable:true })}
            onClick={() => this.setState({tab:1})}
          >
            Submissions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 2, clickable:true })}
            onClick={() => this.setState({tab:2})}
          >
            Reviews
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 3, clickable:true })}
            onClick={() => this.setState({tab:3})}
          >
            Team
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 4, clickable:true })}
            onClick={() => this.setState({tab:4})}
          >
            Points
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={this.state.tab}>
        <TabPane tabId={0}>
          HERE WILL BE OVERVIEW
        </TabPane>
        <TabPane tabId={1}>
          <Submissions history={this.props.history} />
        </TabPane>
        <TabPane tabId={2}>
          Reviews
        </TabPane>
        <TabPane tabId={3}>
          <Team task={this.props.task}/>
        </TabPane>
        <TabPane tabId={4}>
          <Score />
        </TabPane>
      </TabContent>
      </div>
    )
  }
}
