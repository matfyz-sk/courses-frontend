import { coursePrefix } from './prefix'

export const DASHBOARD = coursePrefix('/dashboard')
export const SIGN_UP = '/signup'
export const SIGN_IN = '/signin'
export const COURSES = '/courses'
export const EVENT = '/event'
export const NEW_EVENT = '/newevent'
export const EVENT_ID = '/event/:id'
export const EDIT_EVENT_ID = '/editevent/:id'
export const TIMELINE = coursePrefix('/timeline')
export const TIMELINE_ID = coursePrefix('/timeline/:timeline_id')
export const CREATE_TIMELINE = '/createtimeline/'
export const CREATE_TIMELINE_ID = '/createtimeline/:id'
export const NEW_COURSE = '/newcourse'
export const EDIT_COURSE = '/editcourse/'
export const EDIT_COURSE_ID = '/editcourse/:id'
export const USER_MANAGEMENT = '/usermanagement/'
export const USER_MANAGEMENT_ID = '/usermanagement/:id'
export const COURSE_MIGRATION_ID = '/coursemigration/:id'
export const COURSE_MIGRATION = '/coursemigration/'
export const ASSIGNMENTS = '/assignments'
export const RESULTS = '/results'
export const QUIZ = coursePrefix('/quiz')
export const DOCUMENTS = '/documents'
export const INFO = '/info'

export const COURSE_TEAMS = coursePrefix('/teams')
