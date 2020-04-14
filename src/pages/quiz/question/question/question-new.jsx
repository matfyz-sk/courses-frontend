import React from 'react'
import { Form, Card, CardBody, Label, FormGroup, Input } from 'reactstrap'

import { QuestionTypesEnums } from './question-new-data'
import QuestionAnswers from './question-answers'

const enText = {
  title: 'Title',
  'title-placeholder': 'Add title',
  question: 'Question',
  'question-placeholder': 'What is your question',
  topic: 'Topic',
  'topic-placeholder': 'Topic',
  'question-type': 'Question type',
  create: 'Create',
}

function QuestionNew({
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
  addNewAnswer,
  disabled,
  children,
}) {
  return (
    <Card>
      <CardBody>
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
                  onChange={e => setTitle(e.target.value)}
                />
              </>
            )}
            {disabled && <h3>{title}</h3>}
          </FormGroup>
        )}
        {question !== null && (setQuestion || disabled) && (
          <FormGroup>
            {setQuestion && (
              <>
                <Label for="question">{enText.question}</Label>
                <Input
                  id="question"
                  type="text"
                  name="question"
                  placeholder={enText['title-placeholder']}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </>
            )}
            {disabled && <div>{question}</div>}
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
                        // TODO disabled if out of startDate-endDate
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
          <QuestionAnswers answers={answers} addNewAnswer={addNewAnswer} />
        )}
        {children}
      </CardBody>
    </Card>
  )
}

export default QuestionNew
