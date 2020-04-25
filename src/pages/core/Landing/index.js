import React, { Component } from 'react'
import './Landing.css'
import { store } from '../../../index'
import { setSubNav } from '../../../redux/actions/navigationActions'

class LandingPage extends Component {
  componentDidMount() {
    store.dispatch(setSubNav('dashboard'))
  }

  render() {
    return (
      <main>
        <div>
          <h1>Dashboard</h1>
        </div>
      </main>
    )
  }
}

export default LandingPage
