import { ONTOLOGY_PREFIX } from "constants/ontology"

const enText = {
  'manual-quiz-assignment': 'Manual quiz assignment',
  'generated-quiz-assignment': 'Generated quiz assignment',
}

export const QuestionTypesEnums = Object.freeze({
  multiple: {
    id: `${ ONTOLOGY_PREFIX }QuestionWithPredefinedAnswer`,
    entityName: 'questionWithPredefinedAnswer',
    name: 'Question with predefined answer'
  },
  essay: {
    id: `${ ONTOLOGY_PREFIX }EssayQuestion`,
    entityName: 'essayQuestion',
    name: 'Essay question'
  },
  open: {
    id: `${ ONTOLOGY_PREFIX }OpenQuestion`,
    entityName: 'openQuestion',
    name: 'Open question'
  },
  ordering: {
    id: `${ ONTOLOGY_PREFIX }OrderingQuestion`,
    entityName: 'orderingQuestion',
    name: 'Ordering question'
  },
  matching: {
    id: `${ ONTOLOGY_PREFIX }MatchQuestion`,
    entityName: 'matchingQuestion',
    name: 'Matching question'
  },
})

export const QuizAssignmentTypesEnums = Object.freeze({
  manualQuizAssignment: {
    id: `${ ONTOLOGY_PREFIX }ManualQuizAssignment`,
    middlename: 'manualQuizAssignment',
    name: enText['manual-quiz-assignment'],
  },
  generatedQuizAssignment: {
    id: `${ ONTOLOGY_PREFIX }GeneratedQuizAssignment`,
    middlename: 'generatedQuizAssignment',
    name: enText['generated-quiz-assignment'],
  },
})
