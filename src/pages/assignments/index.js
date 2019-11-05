import React, { Component } from 'react';
import { connect } from "react-redux";

import StudentNavigation from './student';
import TeacherNavigation from './teacher';


class Assignments extends Component{
  render(){
    if(this.props.isAdmin){
      return(<TeacherNavigation />)
    }
    return (<StudentNavigation />)
  }
}


const mapStateToProps = ({ userReducer }) => {
	const { isAdmin } = userReducer;
	return {
    isAdmin
	};
};

export default connect(mapStateToProps, {})(Assignments);
