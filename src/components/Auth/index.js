import React from 'react'
import { store } from '../../index'
import { setToken, setUser, logoutRedux } from '../../redux/actions/authActions'
import {getShortID} from "../../helperFunctions";

/**
 * Store data to storage and redux
 * @param _token
 * @param user
 * @return
 */
export function registerData(_token, user) {
  if (user !== null && _token !== '') {
    store.dispatch(setToken({ name: '_token', value: _token }))
    store.dispatch(setUser({ name: 'user', value: user }))
    localStorage.setItem('_token', _token)
    localStorage.setItem('user', JSON.stringify(user))
    return true
  }
  return false
}

export function getUser() {
  const user = localStorage.getItem('user')
  if (user && user !== '') {
    return JSON.parse(user)
  }
  return null
}

export function getToken() {
  const token = localStorage.getItem('_token')
  if (token && token !== '') {
    return token
  }
  return null
}

export function synchronize() {
  const token = getToken()
  const user = getUser()
  if (token && user) {
    store.dispatch(setToken({ name: '_token', value: token }))
    store.dispatch(setUser({ name: 'user', value: user }))
    return true
  }
  return false
}

export function logout() {
  store.dispatch(logoutRedux())
  localStorage.clear()
  return true
}

export function isLogged() {
  return getToken() && getUser()
}

export function getUserType() {
  const user = getUser()
  if (user) {
    return user.type
  }
  return null
}

export function getUserName() {
  const user = getUser()
  if (user) {
    if (user.useNickName) {
      return user.nickname
    }
    return user.firstName
  }
  return null
}

export function getUserAvatar() {
  const user = getUser()
  if (user) {
    return user.avatar
  }
  return null
}

export function getUserEmail() {
  const user = getUser()
  if (user) {
    return user.email
  }
  return null
}

export function setUserToken(_token) {
  if (_token && _token !== '') {
    store.dispatch(setToken({ name: '_token', value: _token }))
    localStorage.setItem('_token', _token)
    return true
  }
  return false
}

export function setUserProfile(user) {
  if (user !== null) {
    const new_user = { ...getUser(), ...user }
    store.dispatch(setUser({ name: 'user', value: new_user }))
    localStorage.setItem('user', JSON.stringify(new_user))
    return true
  }
  return false
}

export function getUserID() {
  const user = getUser()
  if (user) {
    return user.id
  }
  return null
}

export function authHeader() {
  const token = getToken()
  if (token) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${token}`,
    }
  }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  }
}

export function getUserInCourseType(course_id) {
  const user = getUser()
  if (!course_id) {
    return 'visitor'
  }
  if (!user) {
    return 'visitor'
  }
  for (let i = 0; i < user.studentOf.length; i++) {
    if (getShortID(user.studentOf[i]['@id']) === course_id) {
      return 'student'
    }
  }
  return 'visitor'
}
