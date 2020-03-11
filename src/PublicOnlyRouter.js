import React from 'react';
import {Route, Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";

function PublicOnlyRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={(props) => (
            rest.authReducer._token !== null
                ? <Redirect to='/dashboard' />
                : <Component {...props} />
        )} />
    );
}

const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(PublicOnlyRoute))