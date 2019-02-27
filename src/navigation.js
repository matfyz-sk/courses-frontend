import React, {Component} from 'react';
import { Route} from 'react-router-dom';
import PageHeader from './pageHeader';

import MainPage from './pages/mainPage';
import Assignments from './pages/assignments';
import Files from './pages/files';
import Info from './pages/info';
import Labs from './pages/labs';
import Lectures from './pages/lectures';
import Quiz from './pages/quiz';
import Results from './pages/results';


export default class Navigation extends Component {
  render(){
    return(
          <div>
          <PageHeader {...this.props}/>
            <div className="row">
              <div className="flex">
                <Route exact path='/' component={MainPage} />
                <Route path='/assignments' component={Assignments} />
                <Route exact path='/files' component={Files} />
                <Route exact path='/info' component={Info} />
                <Route exact path='/labs' component={Labs} />
                <Route exact path='/lectures' component={Lectures} />
                <Route exact path='/quiz' component={Quiz} />
                <Route exact path='/results' component={Results} />
              </div>
            </div>
          </div>
    )
  }
}
