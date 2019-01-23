import React, { Component } from 'react';
import { Route} from 'react-router-dom';
import Assignments from './assignments';


export default class Navigation extends Component{

  render(){
    return(
      <div>
        <Route exact path='/assignments' component={Assignments} />
      </div>
    )
  }
}
