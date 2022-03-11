import { useStep } from 'react-hooks-helper'
import React from 'react'
import CourseMigrationForm from '../CourseMigrationForm'
import EventsMigrationForm from '../EventsMigrationForm'
import { QuizzesMigrationForm } from '../QuizzesMigrationForm'
import { AssignmentsMigrationForm } from '../AssignmentsMigrationForm'
import Submit from './Submit'

const steps = [
  {id: 'course'},
  {id: 'events'},
  {id: 'assignments'},
  {id: 'quizzes'},
  {id: 'submit'},
]

export const MultiStepForm = () => {
  const {step, navigation} = useStep({initialStep: 0, steps})
  const {id} = step

  switch(id) {
    case 'course':
      return <CourseMigrationForm navigation={ navigation }/>
    case 'events':
      return <EventsMigrationForm navigation={ navigation }/>
    case 'assignments':
      return <AssignmentsMigrationForm navigation={ navigation }/>
    case 'quizzes':
      return <QuizzesMigrationForm navigation={ navigation }/>
    case 'submit':
      return <Submit navigation={ navigation }/>
    default:
      return null
  }
}
