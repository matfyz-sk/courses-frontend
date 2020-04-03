const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://matfyz.sk:3010/data' // TODO change for local
    : 'https://courses.matfyz.sk:4431'

export default { API_URL }
