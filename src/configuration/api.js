export const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://courses.matfyz.sk:4440'
    : 'https://courses.matfyz.sk:4440'

// DEV apache forward this to matfyz.sk:3010
// 'https://courses.matfyz.sk:4440'

// PRODUCTION apache forward this to matfyz.sk:3011
// PLS DON'T use this server, only when deploying
// 'https://courses.matfyz.sk:4441'

// LOCAL
// 'http://localhost:3010'

export const API_URL = `${BACKEND_URL}/data`

export default { API_URL }
