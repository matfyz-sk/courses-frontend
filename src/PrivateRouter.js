import React from 'react';
import {Route, Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={(props) => (
            rest.authReducer._token !== null
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    );
}

const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(PrivateRoute))