import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Assignments from './assignments';
import Assignment from './assignment';
import 'scss/assignmentOnly.scss';

export default class Navigation extends Component{

  render(){
    return(
      <Switch>
        <Route exact path='/courses/:courseInstanceID/assignments' component={Assignments} />

        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/submission/:tabID' component={Assignment} /> {/*moj assignment, povinny vyber teamu*/}
        <Route path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/team/:teamID/submission/:tabID' component={Assignment} /> {/*nastavi team*/}
        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/review/:targetID/:tabID' component={Assignment} /> {/*hodnotim cudzi kod*/}
        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/:targetID/:tabID' component={Assignment} /> {/*instructor, pozera niekoho*/}
      </Switch>
    )
  }
}
