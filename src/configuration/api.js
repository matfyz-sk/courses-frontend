const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://matfyz.sk:3010/data' // TODO change for local
    : 'http://matfyz.sk:3010/data'

export default { API_URL }
