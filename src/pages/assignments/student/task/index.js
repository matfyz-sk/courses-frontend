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
    return(
      <div>
        <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 0, clickable:true })}
            onClick={() => this.setState({tab:0})}
          >
            Submissions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 1, clickable:true })}
            onClick={() => this.setState({tab:1})}
          >
            Reviews
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 2, clickable:true })}
            onClick={() => this.setState({tab:2})}
          >
            Team
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.tab === 3, clickable:true })}
            onClick={() => this.setState({tab:3})}
          >
            Points
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={this.state.tab}>
        <TabPane tabId={0}>
          <Submissions />
        </TabPane>
        <TabPane tabId={1}>
          <Reviews />
        </TabPane>
        <TabPane tabId={2}>
          <Team task={this.props.task}/>
        </TabPane>
        <TabPane tabId={3}>
          <Score />
        </TabPane>
      </TabContent>
      </div>
    )
  }
}
