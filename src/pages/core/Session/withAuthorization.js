import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { AuthUserContext } from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                courseInstance: undefined,
            }
        }

        async componentDidMount() {
            const { match: { params } } = this.props;

            await this.props.firebase.courseInstance(params.id)
                .get()
                .then(snapshot => {
                    const courseInstance = {...snapshot.data(), cid: snapshot.id};
                    if(courseInstance) {
                        this.state = {
                            courseInstance: courseInstance,
                        };
                    }
                });

            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser, this.state.courseInstance, this.props.firebase)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
                () => this.props.history.push(ROUTES.SIGN_IN),
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} authUser={authUser} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;