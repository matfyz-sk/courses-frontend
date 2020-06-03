import React, { Component } from 'react';
import { Label, Alert, CardHeader, Card, CardBody } from 'reactstrap';
import { getStudentName } from 'helperFunctions';

export default class InstructorTeamReviewDetails extends Component {

  assignStudentToReview( students, reviews ){
    return reviews.map((review) => ({
      ...review,
      createdBy: students.find( (student) => student['@id'] === review.createdBy['@id'] )
    }))
  }

  getStudentsWithoutReviews( students, reviews ){
    return students.filter( (student) =>{
      return  !reviews.some((review) => review.createdBy['@id'] === student['@id'])
    } )
  }

  groupReviewsOfStudents( students, reviews, didntReview ){
    return students.map((student) => ({
      ...student,
      reviews: reviews.filter((review) => review.reviewedStudent[0]['@id'] === student['@id'] )
    })).map((student)=>({
      ...student,
      percentage: (
        ( student.reviews.reduce((acc, review) => acc + review.percentage ,0) + 100 * didntReview.length ) /
        ( students.length - 1 ) - ( didntReview.some( (student2) => student2['@id'] === student['@id'] ) ? 100 : 0 )
      )
    }))
  }

  render(){
    const { students } = this.props;
    const reviews = this.assignStudentToReview( students, this.props.reviews )
    const didntReview = this.getStudentsWithoutReviews( students, reviews )
    return(
      <>
      <Alert color="danger" isOpen={ didntReview.length > 0} className="mt-3">
        Some students left no reviews of their team! Defaulting their review to 100%
        <br/>
        <Label>{`Mentioned students:`}</Label>
        {` ${ didntReview.map((student) => getStudentName(student)).join(', ')}`}
      </Alert>
      { this.groupReviewsOfStudents( students, reviews, didntReview ).map( (student, index) =>
        <div key={student['@id']}>
          <Label>{`Student:`}</Label>{` ${ getStudentName(student) }`}
          <br/>
          <Label className="no-m-p">{`Total percentage: ${ student.percentage }%`}</Label>
          { student.reviews.map( (review) =>
            <Card key={review['@id']} className="small-card">
              <CardHeader className="small-card-header row">
                <span className="mr-auto">
                  <Label>Percentage:</Label> { `${review.percentage}%` }
                  </span>
                  <span>
                    <Label>Teammate:</Label>{` ${getStudentName(review.createdBy)}`}
                    </span>
                  </CardHeader>
                  <CardBody className="row">
                    <div className="col-6">
                      <Label className="no-m-p text-muted small">Comment:</Label>
                      <br/>
                      { review.studentComment }
                    </div>
                    <div className="col-6">
                      <Label className="no-m-p text-muted small clickable not-highlightable"> Private comment: </Label>
                      <br/>
                      { review.privateComment }
                    </div>
                  </CardBody>
                </Card>
              )}
              { index !== students.length -1 && <hr/>}
      </div>
      )}
      </>
    )
  }
}
