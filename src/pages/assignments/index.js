import React, { Component } from 'react';
import UserStore from '../../flux/stores/user';

import StudentNavigation from './student';
import TeacherNavigation from './teacher';


export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      isAdmin:UserStore.isAdmin
    }
  }

  handleUserStoreChange(){
    this.setState({isAdmin:UserStore.isAdmin})
  }

  componentWillMount() {
  UserStore.on("change", this.handleUserStoreChange.bind(this) );
  }


  render(){
    if(this.state.isAdmin){
      return(<TeacherNavigation />)
    }else{
      return (<StudentNavigation />)
    }
  }
}
