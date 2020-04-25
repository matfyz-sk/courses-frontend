import { PRIV_ACTIONS } from '../types/privilegesTypes'

export const setGlobalPrivileges = item => ({
  type: PRIV_ACTIONS.SET_GLOBAL_PRIV,
  item,
})

export const setCourseInstancePrivileges = item => ({
  type: PRIV_ACTIONS.SET_COURSE_INSTANCE_PRIV,
  item,
})
