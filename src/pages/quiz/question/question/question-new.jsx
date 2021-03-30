import React, { useEffect } from 'react'
import { Card, CardBody, Label, FormGroup, Input} from 'reactstrap'

import { QuestionTypesEnums } from './question-new-data'
import QuestionAnswers from './question-answers'
import AnswerComponentOpen from '../common/answer-component/answer-component-open'
import AnswerComponentOrder from '../common/answer-component/answer-component-order'
import WarningMessage from '../../../quiz/common/warning-message'
import { AnswerComponentMatch } from '../common/answer-component/answer-component-match'

const enText = {
  title: 'Title',
  'title-placeholder': 'Add title',
  question: 'Question',
  'question-placeholder': 'Add question text',
  topic: 'Topic',
  'topic-placeholder': 'Topic',
  'question-type': 'Question type',
  create: 'Create',
  'new-question': 'New question',
}

function QuestionNew({
  header,
  metadata,
  title,
  setTitle,
  question,
  setQuestion,
  topic,
  setTopic,
  topicOptions,
  questionType,
  questionTypeOptions,
  setQuestionType,
  answers,
  setRegexp,
  regexp,
  setRegexpUserAnswer,
  regexpUserAnswer,
  setUserAnswer,
  userAnswer,
  addNewAnswer,
  orderAnswers,
  orderAnswersColumn,
  addNewOrderAnswer,
  onDragEnd,
  matchAnswers,
  matchPairs,
  addNewPair,
  disabled,
  children,
  color,
  showWarning,
}) {
  return (
    <Card className = 'mb-3' style={color && { backgroundColor: color }}>
      <CardBody>
        {header && header()}
        {title !== null && (setTitle || disabled) && (
          <FormGroup>
            {setTitle && (
              <>
                <Label for="title">{enText.title}</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder={enText['title-placeholder']}
                  value={title}
                  onChange={e => {setTitle(e.target.value)}}
                />
                <WarningMessage
                  className='mt-3'
                  text = {showWarning.title}
                  isOpen = {showWarning.title}
                />
              </>
            )}
            {disabled && <h3>{title}</h3>}
          </FormGroup>
        )}
        {metadata && metadata()}
        {question !== null && (setQuestion || disabled) && (
          <FormGroup>
            {setQuestion && (
              <>
                <Label for="question">{enText.question}</Label>
                <Input
                  id="question"
                  type="textarea"
                  placeholder={enText['question-placeholder']}
                  value={question}
                  onChange={e => {setQuestion(e.target.value)}}
                />
                <WarningMessage
                  className='mt-3'
                  text={showWarning.question}
                  // isOpen = {showWarning.question}
                />
              </>
            )}
            {disabled && (
              <div style={{ whiteSpace: 'pre-line' }}>{question}</div>
            )}
          </FormGroup>
        )}
        {topic !== null && (setTopic || disabled) && (
          <FormGroup>
            {setTopic && (
              <>
                <Label for="topic">{enText.topic}</Label>
                <Input
                  type="select"
                  name="topic"
                  id="topic"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                >
                  {topicOptions.map(topicOption => {
                    return (
                      <option key={topicOption.id} value={topicOption.id}>
                        {topicOption.name}
                      </option>
                    )
                  })}
                </Input>
              </>
            )}
          </FormGroup>
        )}
        {questionType !== null && setQuestionType && (
          <>
            {setTopic && (
              <FormGroup>
                <Label for="questionType">{enText['question-type']}</Label>
                <Input
                  type="select"
                  name="questionType"
                  id="questionType"
                  value={questionType}
                  onChange={e => setQuestionType(e.target.value)}
                >
                  {questionTypeOptions.map(questionTypeOption => {
                    return (
                      <option
                        key={questionTypeOption.id}
                        value={questionTypeOption.id}
                      >
                        {questionTypeOption.name}
                      </option>
                    )
                  })}
                </Input>
              </FormGroup>
            )}
          </>
        )}
        {questionType === QuestionTypesEnums.multiple.id && (
          <FormGroup>
            <QuestionAnswers
              answers={answers}
              addNewAnswer={addNewAnswer}
            />
          </FormGroup>
        )}
        {questionType === QuestionTypesEnums.open.id && (
          <FormGroup>
            <AnswerComponentOpen
              setRegexp={setRegexp}
              regexp={regexp}
              setRegexpUserAnswer={setRegexpUserAnswer}
              regexpUserAnswer={regexpUserAnswer}
              setUserAnswer={setUserAnswer}
              userAnswer={userAnswer}
            />
          </FormGroup>
        )}
        {/*{questionType === QuestionTypesEnums.essay.id && (*/}
        {/*  null*/}
        {/*)}*/}
        {questionType === QuestionTypesEnums.ordering.id && (
          <FormGroup>
              <AnswerComponentOrder
              orderAnswers={orderAnswers}
              orderAnswersColumn={orderAnswersColumn ||
                {
                  id: "answerColumn",
                  title: "Answers in correct order",
                  answersPositions: orderAnswers.map(answer => answer.position),}
                }
              addNewOrderAnswer={addNewOrderAnswer}
              onDragEnd={onDragEnd}
            />
          </FormGroup>
        )}
        {questionType === QuestionTypesEnums.matching.id && (
         <FormGroup>
           <AnswerComponentMatch
             matchAnswers = {matchAnswers}
             pairs = {matchPairs}
             addNewPair = {addNewPair}
           />
         </FormGroup>
        )}
        {children}
      </CardBody>
    </Card>
  )
}

export default QuestionNew
