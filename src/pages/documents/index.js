import { withRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import DocumentsManager from './documentManager'


function DocumentsNavigation(props) {
    return (
        <Switch>
            <Route exact path='/courses/:course_id/documents/deleted' component={() => <DocumentsManager showingDeleted={true}/>}/>
            <Route exact path='/courses/:course_id/documents/' render={() => <DocumentsManager showingDeleted={false}/>}/>
        </Switch>
    )
}

const mapStateToProps = (state) => {
    return state;
}
  
export default withRouter(connect(mapStateToProps)(DocumentsNavigation))