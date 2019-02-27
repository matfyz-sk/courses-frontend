import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Assignments from './assignments';
import ViewSubmission from './task/submission/viewSubmission';
import ViewReview from './task/review/viewReview';

export default class Navigation extends Component{

  render(){
    return(
      <div>
        <Route exact path='/assignments' component={Assignments} />
        <Route exact path='/assignments/view/:id' component={ViewSubmission} />
        <Route exact path='/assignments/edit/:id' component={ViewSubmission} />
        <Route exact path='/assignments/reviews/:id' component={ViewReview} />
      </div>
    )
  }
}
