import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Container} from 'reactstrap';
import Navigation from "./MainNavigation";


class Layout extends Component {
  render(){
    return(
      <div>
        <Navigation {...this.props}/>
          <Container>
              {this.props.children}
          </Container>
      </div>
    )
  }
}

const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(Layout))
