import React from 'react';
import GitHubLogin from 'react-github-login';
import GithubIcon from '../../images/icons/github.svg';
import '../../scss/auth_btn.scss';
import { BACKEND_URL } from '../../configuration/api';

const CLIENT_ID = 'f937b5e763fd295e11b9';
const REDIRECT_URI = `${BACKEND_URL}/auth/github`;

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

const GithubAuth = () => (
  <GitHubLogin
    clientId={CLIENT_ID}
    redirectUri={REDIRECT_URI}
    onSuccess={onSuccess}
    onFailure={onFailure}
    className="github"
  >
    <div className="content">
      <div className="icon">
        <img src={GithubIcon} alt="github" />
      </div>
      <div className="title">Login with GitHub</div>
    </div>
  </GitHubLogin>
);

export default GithubAuth;
