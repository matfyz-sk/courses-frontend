import React, { Component } from 'react';
import {Button,Card, CardHeader, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import CodeReview from './codeReview';
import TextReview from './textReview';
import SingleReview from './singleReview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const reviews = [
  {id:2,title:'Review 3',active:true, deadline:1604047500,body:'AAH' },
  {id:1,title:'Review 2',active:false, deadline:1549788300, body:'BBB' },
  {id:0,title:'Review 1',active:false, deadline:1547109900, body:'CCC' },
]

const selectStyle = {
			control: base => ({
				...base,
				minWidth: 250,
			})
		};

const reviewsSelect = [
  {value:0,label:'Review 1',active:false, deadline:1547109900, body:'CCC' },
  {value:1,label:'Review 2',active:false, deadline:1549788300, body:'BBB' },
  {value:2,label:'Review 3',active:true, deadline:1604047500,body:'AAH' },
]

export default class ViewSubmission extends Component{
  constructor(props){
    super(props);
    this.state={
      tab:0,
      open:false,
      review:reviews.find((item)=>item.id===parseInt(this.props.match.params.id))
    }
  }

  toggle(){
    this.setState({open:!this.state.open})
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
        </div>
    )
  }
}
