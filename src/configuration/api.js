export const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://courses.matfyz.sk:4440' // TESTING
    : 'https://courses.matfyz.sk:4440'
//  'https://courses.matfyz.sk:4440'
// 'https://courses.matfyz.sk:4441' // PRODUCTION PLS DON'T use this server, only when deploying
// 'http://localhost:3010' // Local

export const API_URL = `${BACKEND_URL}/data`

export default { API_URL }
