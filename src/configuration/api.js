export const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://matfyz.sk:3010' // TESTING
    : 'http://matfyz.sk:3010'
//  'https://courses.matfyz.sk:4440' // TESTING apache forward this to matfyz.sk:3010
// 'https://courses.matfyz.sk:4441' // PRODUCTION PLS DON'T use this server, only when deploying
// apache forward this to matfyz.sk:3011

// 'http://localhost:3010' // LOCAL

export const API_URL = `${BACKEND_URL}/data`

export default { API_URL }
