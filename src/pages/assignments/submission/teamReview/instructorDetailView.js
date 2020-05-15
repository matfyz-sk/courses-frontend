import React, { Component } from 'react';
import { FormGroup, Label, Input, Alert, Table } from 'reactstrap';
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
    console.log(reviews);
    return(
      <>
      <Alert color="danger" isOpen={ didntReview.length > 0} className="mt-3">
        Some students left no reviews of their team! Defaulting their review to 100%
        <br/>
        <Label>{`Mentioned students:`}</Label>
        {` ${ didntReview.map((student) => getStudentName(student)).join(', ')}`}
      </Alert>
      { this.groupReviewsOfStudents( students, reviews, didntReview ).map( (student) =>
        <div key={student['@id']}>
          <Label>{`Student: ${ getStudentName(student) }`}</Label>
          <br/>
          <Label className="no-m-p">{`Total percentage: ${ student.percentage }%`}</Label>
          <Table borderless>
            <tbody>
              { student.reviews.map((review) =>
                <tr key={review['@id']}>
                  <td
                    style={{
                        whiteSpace: 'nowrap',
                        width: '1%'
                    }}>
                    <Label className="no-m-p">{ getStudentName(review.createdBy) }</Label>
                    <br/>
                    <Label className="no-m-p">Percentage:</Label> { `${review.percentage}%` }
                  </td>
                  <td>
                    <p>
                    <Label className="no-m-p text-muted small">Student comment:</Label>
                    <br/>
                    { review.studentComment }
                  </p>
                  <p>
                    <Label className="no-m-p text-muted small">Private comment:</Label>
                    <br/>
                  { review.privateComment }
                </p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <hr/>
      </div>
      )}
      </>
    )
  }
}
