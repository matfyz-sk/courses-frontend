import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Assignments from './assignments';
import AssignmentRedirect from './assignmentRedirect';

export default class Navigation extends Component{

  render(){
    return(
      <div>
        <Route exact path='/assignments' component={Assignments} />
        <Route exact path='/assignments/view/:id/:tabID' component={AssignmentRedirect} />
        <Route exact path='/assignments/edit/:id/:tabID' component={AssignmentRedirect} />
      </div>
    )
  }
}
