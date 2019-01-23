import React, {Component} from 'react';
import { Route} from 'react-router-dom';
import PageHeader from './pageHeader';
import App from './App';


export default class Navigation extends Component {
  render(){
    return(
          <div>
          <PageHeader {...this.props}/>
            <div className="row">
              <div className="flex">
                <Route exact path='/' component={App} />
              </div>
            </div>
          </div>
    )
  }
}
