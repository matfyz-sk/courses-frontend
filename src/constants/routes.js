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
export const QUIZ = coursePrefix('/quiz')
export const INFO_PAGE = '/info/:course_id'
export const ACCESS_DENIED = '/accessdenied'
export const NOT_FOUND = '/notfound'
export const TOPICS = '/topics'

export const DOCUMENTS = coursePrefix('/documents')
export const DOCUMENTS_IN_FOLDER = coursePrefix('/documents/folder/:folder_id')
export const DELETED_DOCUMENTS = coursePrefix('/documents/deleted')
export const EDIT_DOCUMENT = coursePrefix('/documents/edit/:document_id')
export const DOCUMENT_HISTORY = coursePrefix('/documents/history')

export const COURSE_TEAMS = coursePrefix('/teams')
export const COURSE_TEAM_CREATE = coursePrefix('/team-create')
export const COURSE_TEAM_DETAIL = coursePrefix('/teams/:team_id')

export const PUBLIC_PROFILE = '/profile/:user_id'
export const REGISTER_COMPLETION = '/register-completion'

export const MY_RESULTS = coursePrefix('/my-results')
export const RESULTS = coursePrefix('/results')
export const RESULT_TYPE = coursePrefix('/results/type/:result_type_id')
export const RESULT_USER = coursePrefix('/results/user/:user_id')
export const RESULT_DETAIL = coursePrefix('/results/detail/:result_id')

export const USER_DASHBOARD = '/dashboard'
