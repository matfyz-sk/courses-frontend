import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Navbar,
    Nav,
} from 'reactstrap';
import { connect } from "react-redux";
import { setUserAdmin } from './redux/actions';
import GlobalMenu from "./components/navigation/GlobalMenu";
import AuthOnlyMenu from "./components/navigation/AuthOnlyMenu";
import UserDropdown from "./components/navigation/UserDropdown";
import NotLoggedOnly from "./components/navigation/NotLoggedOnly";

class Navigation extends Component{
    render(){
        const authenticated = this.props.authReducer._token !== null;
        return(
            <Navbar color="light" light expand="md" className={"mb-4"}>
                <Link className="navbar-brand" to={'/dashboard'}>Webdesign</Link>
                <Nav navbar>
                    {!authenticated ? <NotLoggedOnly/> : null}
                    {<GlobalMenu />}
                    {authenticated ? <AuthOnlyMenu/> : null}
                </Nav>
                {authenticated ?
                    <Nav className="ml-auto" navbar>
                        <UserDropdown name={this.props.authReducer.user.name} avatar={this.props.authReducer.user.avatar} />
                    </Nav>
                : null
                }
            </Navbar>
        )
    }
}

const mapStateToProps = ({ userReducer }) => {
    const { isAdmin } = userReducer;
    return {
        isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Navigation);
