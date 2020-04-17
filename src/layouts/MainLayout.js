import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MainNavigation from '../components/Navigation/MainNavigation'
import { synchronize } from '../components/Auth'

class MainLayout extends Component {
  componentDidMount() {
    synchronize()
  }

  render() {
    return (
      <>
        <MainNavigation {...this.props} />
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {this.props.children}
      </>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(MainLayout))
