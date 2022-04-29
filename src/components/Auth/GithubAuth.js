import React, { useState } from 'react'
import { withRouter } from 'react-router'
import GitHubLogin from 'react-github-login'
import GithubIcon from '../../images/icons/github.svg'
import '../../scss/auth_btn.scss'
import { authHeader, registerData } from './index'
import { REGISTER_COMPLETION } from '../../constants/routes'
import { Alert } from 'reactstrap'
import { BACKEND_URL } from "../../constants";

const CLIENT_ID = 'f937b5e763fd295e11b9'
const REDIRECT_URI = `http://localhost:3000`

const GithubAuth = props => {
  const [error, setError] = useState(null)

  function onSuccess(resp) {
    fetch(`${BACKEND_URL}auth/github?code=${resp.code}`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.status) {
          // eslint-disable-next-line no-underscore-dangle
          if (registerData(data._token, data.user)) {
            if(data.user.email === "") {
              // eslint-disable-next-line react/destructuring-assignment
              props.history.push(REGISTER_COMPLETION)
            } else {
              // eslint-disable-next-line react/destructuring-assignment
              props.history.push('/dashboard')
            }
          }
        }
        setError('Something was wrong. Please, try it again.')
      })
  }

  function onFailure(resp) {
    setError(resp)
  }

  return (
    <>
      {error ? <Alert color="danger">{error}</Alert> : null}
      <GitHubLogin
        clientId={CLIENT_ID}
        redirectUri={REDIRECT_URI}
        onSuccess={e => onSuccess(e)}
        onFailure={e => onFailure(e)}
        className="github"
      >
        <div className="content">
          <div className="icon">
            <img src={GithubIcon} alt="github" />
          </div>
          <div className="title">Login with GitHub</div>
        </div>
      </GitHubLogin>
    </>
  )
}

export default withRouter(GithubAuth)
