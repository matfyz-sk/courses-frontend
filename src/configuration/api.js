const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3010/data'
    : 'http://matfyz.sk:3010/data'

export default { API_URL }
