import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import { store } from '../../index'
import {
  setTeacherNav,
  setTeacherNavCurrent,
  unsetTeacherNav,
} from '../../redux/actions'

export default class TeacherNavigation extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.href_array && this.props.href_array.length > 0) {
      store.dispatch(setTeacherNav(this.props.href_array))
      store.dispatch(setTeacherNavCurrent(this.props.currentKey))
    }
  }

  componentWillUnmount() {
    store.dispatch(unsetTeacherNav)
  }

  render() {
    if(this.props.href_array.length > 0) {
      return <SideTeacherNavigation {...this.props} />
    }
    return null
  }
}

const SideTeacherNavigation = ({ currentKey, href_array }) => {
  const menu = []
  for (let i = 0; i < href_array.length; i++) {
    menu.push(
      <li
        className={`block-menu-item list-group-item ${
          currentKey === href_array[i].key ? 'active' : ''
        }`}
        key={href_array[i].key}
      >
        <Link to={href_array[i].href}>{href_array[i].name}</Link>
      </li>
    )
  }
  return (
    <Col xs={3} className="timeline-left-col teacher-menu">
      <ul className="block-menu block-menu-non-toggle list-group">
        <li className="timeline list-group-item">Admin menu</li>
        {menu}
      </ul>
    </Col>
  )
}
