import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Assignments from './assignments';
import Assignment from './assignment';

export default class Navigation extends Component{

  render(){
    return(
      <>
        <Route exact path='/course/:courseID/assignments' component={Assignments} />
        <Route exact path='/course/:courseID/assignments/view/:assignmentID/:submissionID/:tabID' component={Assignment} />
        <Route exact path='/course/:courseID/assignments/edit/:assignmentID/:tabID' component={Assignment} />
        <Route exact path='/course/:courseID/assignments/review/:assignmentID/:submissionID/:tabID' component={Assignment} />
      </>
    )
  }
}
