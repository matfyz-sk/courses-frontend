const enText = {
  'manual-quiz-assignment': 'Manual quiz assignment',
  'generated-quiz-assignment': 'Generated quiz assignment',
}

export const QuestionTypesEnums = Object.freeze({
  multiple: {
    id: 'http://www.courses.matfyz.sk/ontology#QuestionWithPredefinedAnswer',
    entityName: 'questionWithPredefinedAnswer',
    name: 'Question with predefined answer'
  },
  essay: {
    id: 'http://www.courses.matfyz.sk/ontology#EssayQuestion',
    entityName: 'essayQuestion',
    name: 'Essay question'
  },
  open: {
    id: 'http://www.courses.matfyz.sk/ontology#OpenQuestion',
    entityName: 'openQuestion',
    name: 'Open question'
  },
  ordering: {
    id: 'http://www.courses.matfyz.sk/ontology#OrderingQuestion',
    entityName: 'orderingQuestion',
    name: 'Ordering question'
  },
  matching: {
    id: 'http://www.courses.matfyz.sk/ontology#MatchQuestion',
    entityName: 'matchingQuestion',
    name: 'Matching question'
  },
})

export const QuizAssignmentTypesEnums = Object.freeze({
  manualQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#ManualQuizAssignment',
    middlename: 'manualQuizAssignment',
    name: enText['manual-quiz-assignment'],
  },
  generatedQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#GeneratedQuizAssignment',
    middlename: 'generatedQuizAssignment',
    name: enText['generated-quiz-assignment'],
  },
})
