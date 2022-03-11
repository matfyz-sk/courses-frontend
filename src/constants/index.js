export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?
    process.env.REACT_APP_BACKEND_URL :
    'http://localhost:3010';

export const API_URL = `${ BACKEND_URL }/data`;
