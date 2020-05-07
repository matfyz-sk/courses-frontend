import apiConfig from '../../../configuration/api'

export const INITIAL_COURSE_STATE = {
  id: '',
  name: '',
  description: '',
  abbreviation: '',
  prerequisites: [],
  admins: [],
}

export const INITIAL_INFO_STATE = {
  name: '',
  description: '',
  abbreviation: '',
  prerequisites: [],
  startDate: new Date(),
  endDate: new Date(),
  instructors: [],
}

export const INITIAL_EVENT_STATE = {
  id: '',
  fullId: '',
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  place: '',
  type: 'Lecture',
  courseInstance: '',
  instructors: [],
  // materials: [],
  uses: [],
  recommends: [],
}

export const BASE_URL = apiConfig.API_URL
export const COURSE_URL = '/course'
export const COURSE_INSTANCE_URL = '/courseInstance'
export const EVENT_URL = '/event'
export const BLOCK_URL = '/block'
export const USER_URL = '/user'
export const MATERIAL_URL = '/material'

export const TASKS_EXAMS = ['OralExam', 'TestTake']

export const TASKS_DEADLINES = [
  'AssignmentPeriod',
  'QuestionAssignment',
  'GeneratedQuizAssignment',
  'ManualQuizAssignment',
]

export const SESSIONS = ['Lab', 'Lecture']

export const INITIAL_MIGRATION_STATE = {
  initialized: false,
  instanceOf: [],
  startDate: new Date(),
  endDate: new Date(),
  name: '',
  description: '',
  instructors: [],
  allEvents: [],
  checkedEvents: [],
  assignments: [],
  quizzes: [],
}
