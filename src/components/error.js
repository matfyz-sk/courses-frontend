import React, { Component } from 'react';
import { Alert } from 'reactstrap';

export default class Error extends Component{

  render(){
    if(this.props.show===undefined){
      return <div className="error-style">{`DEFINE PARAMETER SHOW - add to the component parameter show={true/false condition}`}</div>
    }
    if(!this.props.show){
      return null
    }
    return(
      <div>
        <Alert color="danger" className="error-style">
          <i className="fa fa-exclamation-triangle" /> {this.props.message?this.props.message:'No message defined!'}
        </Alert>
      </div>
    )
  }
}
