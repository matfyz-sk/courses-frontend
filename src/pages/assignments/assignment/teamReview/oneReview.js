import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import Slider from 'components/slider';

export default class OneReview extends Component {
  render(){
    const student = this.props.student;
    let studentName = ( student.useNickname && !student.nickNameTeamException ) ? student.nickname : `${student.firstName} ${student.lastName}`;
    return(
      <>
        <Label className="bold" for="teamName">{studentName}</Label>
        <FormGroup>
          <Label for="teamName">Percentage</Label>
          <Slider
            min={0}
            max={100}
            value={this.props.percentage}
            onChange={(percentage)=>{
              this.props.onChange({
                percentage,
                studentComment: this.props.studentComment,
                privateComment: this.props.privateComment
              })
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="teamName">Comment for the student</Label>
          <Input
            type="textarea"
            value={this.props.studentComment}
            onChange={(e)=>{
              this.props.onChange({
                percentage: this.props.percentage,
                studentComment: e.target.value,
                privateComment: this.props.privateComment
              })
            }}
            placeholder="Enter voluntary comment for your teammate"
            />
        </FormGroup>
        <FormGroup>
          <Label for="teamName">Private comment for the teacher</Label>
          <Input
            type="textarea"
            value={this.props.privateComment}
            onChange={(e)=>{
              this.props.onChange({
                percentage: this.props.percentage,
                studentComment: this.props.studentComment,
                privateComment: e.target.value
              })
            }}
            placeholder="Enter private voluntary comment for the teacher"
            />
        </FormGroup>
      </>
    )
  }
}
