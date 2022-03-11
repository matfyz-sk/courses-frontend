import { Route } from 'react-router-dom';
import React from 'react';
import PublicOnlyRoute from './PublicOnlyRoute';
import PrivateOnlyRoute from './PrivateOnlyRoute';

function RouteWrapper({
                        component: Component,
                        layout: Layout,
                        auth,
                        visitor,
                        ...rest
                      }) {
  if(!auth && visitor) {
    return (
      <PublicOnlyRoute
        { ...rest }
        component={ props => (
          <Layout { ...props }>
            <Component { ...props } />
          </Layout>
        ) }
      />
    );
  }
  if(auth && !visitor) {
    return (
      <PrivateOnlyRoute
        { ...rest }
        component={ props => (
          <Layout { ...props }>
            <Component { ...props } />
          </Layout>
        ) }
      />
    );
  }
  if(!Layout) {
    return <Route { ...rest } component={ props => <Component { ...props } /> }/>;
  }
  return (
    <Route
      { ...rest }
      component={ props => (
        <Layout { ...props }>
          <Component { ...props } />
        </Layout>
      ) }
    />
  );
}

export default RouteWrapper;
