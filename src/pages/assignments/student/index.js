import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Assignments from './assignments';
import Assignment from './assignment';

export default class Navigation extends Component{

  render(){
    return(
      <div>
        <Route exact path='/assignments' component={Assignments} />
        <Route exact path='/assignments/view/:id/:tabID' component={Assignment} />
        <Route exact path='/assignments/edit/:id/:tabID' component={Assignment} />
      </div>
    )
  }
}
