import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MainNavigation from '../components/Navigation/MainNavigation'
import { getUser, synchronize } from '../components/Auth'
import { REGISTER_COMPLETION } from '../constants/routes'

class MainLayout extends Component {
  componentDidMount() {
    if(
      getUser() &&
      getUser().email === '' &&
      window.location.pathname !== REGISTER_COMPLETION
    ) {
      this.props.history.push(REGISTER_COMPLETION)
    } else if(window.location.pathname === REGISTER_COMPLETION) {
      this.props.history.push('/dashboard')
    }
    synchronize()
  }

  render() {
    return (
      <>
        <MainNavigation { ...this.props } />
        {/* eslint-disable-next-line react/destructuring-assignment */ }
        { this.props.children }
      </>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(MainLayout))
