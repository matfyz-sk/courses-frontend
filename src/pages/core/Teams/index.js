import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class Teams extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <>TEAMS</>
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(Teams))
