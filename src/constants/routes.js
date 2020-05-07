import { coursePrefix } from './prefix'

export const DASHBOARD = coursePrefix('/dashboard')
export const PROFILE_SETTINGS = '/profile-settings'
export const PRIVACY_SETTINGS = '/privacy-settings'
export const COURSES = '/courses'
export const NEW_EVENT = coursePrefix('/newevent')
export const EVENT_ID = coursePrefix('/event/:event_id')
export const EDIT_EVENT_ID = coursePrefix('/editevent/:event_id')
export const TIMELINE = coursePrefix('/timeline')
export const CREATE_TIMELINE = coursePrefix('/createtimeline/')
export const COURSE_ID = '/course/:course_id'
export const NEW_COURSE = '/newcourse'
export const EDIT_COURSE_ID = '/editcourse/:course_id'
export const NEW_COURSE_INSTANCE = '/newcourseinstance/:course_id'
export const USER_MANAGEMENT = coursePrefix('/usermanagement/')
export const COURSE_MIGRATION = coursePrefix('/coursemigration/')
export const ASSIGNMENTS = coursePrefix('/assignments')
export const RESULTS = '/results'
export const QUIZ = coursePrefix('/quiz')
export const DOCUMENTS = '/documents'
export const INFO_PAGE = '/info/:course_id'
export const ACCESS_DENIED = '/accessdenied'
export const NOT_FOUND = '/notfound'

export const COURSE_TEAMS = coursePrefix('/teams')
export const COURSE_TEAM_CREATE = coursePrefix('/team-create')
export const COURSE_TEAM_EDIT = coursePrefix('/team-edit/:team_id')
export const COURSE_TEAM_INSTANCE = coursePrefix('/teams/:team_id')
export const COURSE_TEAM_INSTANCE_CREATE = coursePrefix(
  '/teams/:team_id/create-team-instance'
)
export const COURSE_TEAMS_DETAIL = coursePrefix(
  '/teams/:team_id/:teamInstance_id'
)
