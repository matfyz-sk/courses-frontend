import React, { Component } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import Slider from 'components/slider';
import ErrorMessage from 'components/error';

export default class Questionare extends Component {
  render() {
    return (
      <>
        { this.props.questionare.map((question, index) =>
          <div key={ question.id }>
            <Label for="rating">Question:</Label>{ ' ' + question.question.question }
            { question.rated &&
              <FormGroup className="row">
                <Label for="rating">Rating ({ question.score })</Label>
                <Slider
                  className='ml-3 slider-100 center-hor'
                  min={ 0 }
                  max={ 5 }
                  value={ question.score }
                  onChange={ (score) => {
                    let newQuestionare = [ ...this.props.questionare ];
                    newQuestionare[index] = {
                      ...newQuestionare[index],
                      score
                    }
                    this.props.onChange(newQuestionare);
                  } }
                />
              </FormGroup>
            }
            <FormGroup>
              <Label for="teamName">Question answer</Label>
              <Input
                type="textarea"
                value={ question.answer }
                onChange={ (e) => {
                  let newQuestionare = [ ...this.props.questionare ];
                  newQuestionare[index] = {
                    ...newQuestionare[index],
                    answer: e.target.value
                  }
                  this.props.onChange(newQuestionare);
                } }
                placeholder="Please answer the question in at least 10 characters"
              />
            </FormGroup>
            <ErrorMessage show={ question.answer.length > 0 && question.answer.length < 10 }
                          message="Review answer be at least 10 characters!"/>
          </div>
        ) }
        <Button
          color="primary"
          disabled={ this.props.saving || this.props.questionare.some((questionAnswer) => questionAnswer.answer.length < 10) }
          onClick={ this.props.submit }
        >
          { this.props.saving ? 'Saving review' : 'Save review' }
        </Button>
      </>
    )
  }
}
