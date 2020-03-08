import React from 'react';
import {store} from "../../index";
import {setToken, setUser, logoutRedux} from "../../redux/actions/authActions";

/**
 * Store data to storage and redux
 * @param _token
 * @param user
 * @return
 */
export function registerData(_token, user) {
    if(user !== null && _token !== "") {
        store.dispatch(setToken({name: '_token', value: _token}));
        store.dispatch(setUser({name: 'user', value: user}));
        localStorage.setItem("_token", _token);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
    }
    return false;
}

export function synchronize() {
    const _token = localStorage.getItem('_token');
    const user = localStorage.getItem('user');
    if(_token && _token !== "" && user && user !== "") {
        store.dispatch(setToken({name: '_token', value: _token}));
        store.dispatch(setUser({name: 'user', value: JSON.parse(user)}));
        return true;
    }
    return false;
}

export function logout() {
    store.dispatch(logoutRedux());
    localStorage.clear();
    return true;
}

export function isLogged() {
    const _token = localStorage.getItem('_token');
    const user = localStorage.getItem('user');
    return _token && _token !== "" && user && user !== "";
}

export function getUser() {
    const user = localStorage.getItem('user');
    if(user && user !== "") {
        return JSON.parse(user);
    }
    return null;
}

export function getToken() {
    const _token = localStorage.getItem('_token');
    if(_token && _token !== "") {
        return _token;
    }
    return null;
}

export function getUserType() {
    const user = getUser();
    if(user) {return user.type;}
    return null;
}

export function getUserEmail() {
    const user = getUser();
    if(user) {return user.email;}
    return null;
}

export function setUserToken(_token) {
    if(_token && _token !== "") {
        store.dispatch(setToken({name: '_token', value: _token}));
        localStorage.setItem("_token", _token);
        return true;
    }
    return false;
}

export function setUserProfile(user) {
    if(user !== null) {
        store.dispatch(setUser({name: 'user', value: user}));
        localStorage.setItem("user", JSON.stringify(user));
        return true;
    }
    return false;
}