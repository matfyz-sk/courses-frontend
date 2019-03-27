import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import Assignment from './assignment';
import Review from './review';

export default class AssignmentRedirect extends Component{

  render(){
    if(parseInt(this.props.match.params.id)>2){
      return(
        <Review {...this.props} />
      )
    }
    return(
      <Assignment {...this.props} />
    )
  }
}
