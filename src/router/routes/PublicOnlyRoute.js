import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getToken } from '../../components/Auth';

function PublicOnlyRoute({ component: Component, ...rest }) {
  const token = getToken();
  return (
    <Route {...rest} render={(props) => (
      token !== null
        ? <Redirect to='/dashboard' />
        : <Component {...props} />
    )} />
  );
}

const mapStateToProps = state => {
  return state;
};

export default withRouter(connect(mapStateToProps)(PublicOnlyRoute));
