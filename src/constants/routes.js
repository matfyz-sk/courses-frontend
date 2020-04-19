import { coursePrefix } from './prefix'

export const DASHBOARD = coursePrefix('/dashboard')
export const SIGN_UP = '/signup'
export const SIGN_IN = '/signin'
export const PROFILE_SETTINGS = '/profile-settings'
export const PRIVACY_SETTINGS = '/privacy-settings'
export const COURSES = '/courses'
export const NEW_EVENT = coursePrefix('/newevent')
export const EVENT_ID = coursePrefix('/event/:event_id')
export const EDIT_EVENT_ID = coursePrefix('/editevent/:event_id')
export const TIMELINE = coursePrefix('/timeline')
export const CREATE_TIMELINE = coursePrefix('/createtimeline/')
export const NEW_COURSE = '/newcourse'
export const EDIT_COURSE = '/editcourse/'
export const USER_MANAGEMENT = coursePrefix('/usermanagement/')
export const COURSE_MIGRATION = coursePrefix('/coursemigration/')
export const ASSIGNMENTS = '/assignments'
export const RESULTS = '/results'
export const QUIZ = coursePrefix('/quiz')
export const DOCUMENTS = '/documents'
export const INFO = '/info'

export const COURSE_TEAMS = coursePrefix('/teams')
export const COURSE_TEAMS_DETAIL = coursePrefix('/teams/:team_id')
