import apiConfig from '../../../configuration/api'

export const TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU'

export const INITIAL_COURSE_STATE = {
  id: '',
  name: '',
  description: '',
  abbreviation: '',
  prerequisites: [],
  admins: [],
}

export const INITIAL_EVENT_STATE = {
  id: '',
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  place: '',
  type: '',
}

export const BASE_URL = apiConfig.API_URL
export const COURSE_URL = '/course'
export const COURSE_INSTANCE_URL = '/courseInstance'
export const EVENT_URL = '/event'
export const USER_URL = '/user'
