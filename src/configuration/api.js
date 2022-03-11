export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?
    process.env.REACT_APP_BACKEND_URL :
    'https://courses.matfyz.sk:4440';

export const API_URL = `${BACKEND_URL}/data`;
