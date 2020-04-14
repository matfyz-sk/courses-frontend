import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavigationCourse } from '../components/Navigation';
import { store } from '../index';
import { setMainNav } from '../redux/actions/navigationActions';

class CourseLayout extends Component {

  componentDidMount() {
    store.dispatch(setMainNav('courses'));
  }

  render() {
    return (
      <>
        <NavigationCourse name={"Webdesign"} />
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {this.props.children}
      </>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default withRouter(connect(mapStateToProps)(CourseLayout));
