import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getToken } from "../../components/Auth";

function PrivateOnlyRoute({component: Component, ...rest}) {
  const token = getToken();
  return (
    <Route { ...rest } render={ (props) => (
      token !== null
        ? <Component { ...props } />
        : <Redirect to='/login'/>
    ) }/>
  );
}

const mapStateToProps = (state) => {
  return state;
};

export default withRouter(connect(mapStateToProps)(PrivateOnlyRoute));
