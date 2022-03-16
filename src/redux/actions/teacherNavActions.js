import {
  UNSET_TEACHER_NAV,
  SET_TEACHER_NAV_CURRENT,
  SET_TEACHER_NAV,
} from '../types/teacherNavTypes'

export const setTeacherNav = item => ({
  type: SET_TEACHER_NAV,
  item,
})

export const setTeacherNavCurrent = item => ({
  type: SET_TEACHER_NAV_CURRENT,
  item,
})

export const unsetTeacherNav = {
  type: UNSET_TEACHER_NAV,
}
