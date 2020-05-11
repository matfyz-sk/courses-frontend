import { PRIV_ACTIONS } from '../types'

export const setGlobalPrivileges = item => ({
  type: PRIV_ACTIONS.SET_GLOBAL_PRIV,
  item,
})

export const setCourseInstancePrivileges = item => ({
  type: PRIV_ACTIONS.SET_COURSE_INSTANCE_PRIV,
  item,
})

export const setCourseInstanceInstructor = () => ({
  type: PRIV_ACTIONS.SET_CI_INSTRUCTOR,
})

export const resetPrivileges = () => ({
  type: PRIV_ACTIONS.RESET_PRIVILEGES,
})
