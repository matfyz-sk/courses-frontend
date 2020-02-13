import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Assignments from './assignments';
import Assignment from './assignment';
import Review from './review';
import Page404 from "../../../errors/404page";

export default class Navigation extends Component{

  render(){
    return(
      <div>
          <Switch>
                <Route exact path='/assignments' component={Assignments} />
                <Route exact path='/assignments/view/:id/:tabID' component={Assignment} />
                <Route exact path='/assignments/edit/:id/:tabID' component={Assignment} />
                <Route exact path='/assignments/review/:id/:tabID' component={Review} />
                <Route component={Page404} />
          </Switch>
      </div>
    )
  }
}
