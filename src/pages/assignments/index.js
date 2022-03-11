import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Assignments from './assignments';
import Submission from './submission';
import 'scss/assignmentOnly.scss';

export default class Navigation extends Component {

  render() {
    return (
      <Switch>
        <Route exact path='/courses/:courseInstanceID/assignments' component={ Assignments }/>

        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/submission/:tabID'
               component={ Submission }/> {/*moj assignment, povinny vyber teamu*/ }
        <Route exact
               path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/team/:teamID/submission/:tabID'
               component={ Submission }/> {/*nastavi team*/ }
        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/review/:toReviewID/:tabID'
               component={ Submission }/> {/*team alebo student hodnoti cudzi kod*/ }
        <Route exact path='/courses/:courseInstanceID/assignments/assignment/:assignmentID/:targetID/:tabID'
               component={ Submission }/> {/*instructor, pozera niekoho*/ }
      </Switch>
    )
  }
}
