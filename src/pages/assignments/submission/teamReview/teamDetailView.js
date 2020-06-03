import React, { Component } from 'react';
import { Label, Alert, CardBody, Card, CardHeader, Collapse } from 'reactstrap';
import { getStudentName } from 'helperFunctions';

export default class TeamReviewDetails extends Component {
  constructor(props){
    super(props);
    this.state={
      opened: []
    }
  }

  render(){
    const { myReviews, reviews, students } = this.props;
    const totalScore = (reviews.reduce((acc, review) => acc + review.percentage ,0) + (students.length - reviews.length) * 100)/students.length
    return(
      <>
      <div className="mt-3">
        <h4>Reviews of you</h4>
        <Label>Total percentage:</Label>{` ${totalScore}%`}
          { reviews.map( (review) =>
            <Card key={review['@id']} className="small-card">
              <CardHeader className="small-card-header"><Label>Percentage:</Label> { `${review.percentage}%` }</CardHeader>
              <CardBody>
                <Label className="no-m-p text-muted small">Comment:</Label>
                <br/>
                { review.studentComment }
              </CardBody>
            </Card>
            )}

            <h4 className="mt-3">Reviews you gave to your team</h4>
            <Alert color="danger" isOpen={ myReviews.length === 0} className="mt-3">
              You didn't review your team!
            </Alert>
            { myReviews.map( (review) =>
              <Card key={review['@id']} className="small-card">
                <CardHeader className="small-card-header row">
                  <span className="mr-auto">
                    <Label>Percentage:</Label> { `${review.percentage}%` }
                  </span>
                  <span>
                    <Label>Teammate:</Label>{` ${getStudentName(review.reviewedStudent[0])}`}
                  </span>
                </CardHeader>
                <CardBody className="row">
                  <div className="col-6">
                  <Label className="no-m-p text-muted small">Comment:</Label>
                  <br/>
                  { review.studentComment }
                </div>
                <div className="col-6">
                <Label className="no-m-p text-muted small clickable not-highlightable" onClick={()=>{
                    if(this.state.opened.includes(review['@id'])){
                      this.setState({ opened: this.state.opened.filter((reviewID) => reviewID !== review['@id'] ) })
                    }else{
                      this.setState({ opened: [ this.state.opened, review['@id'] ] })
                    }
                  }}>
                  Private comment (click to {this.state.opened.includes(review['@id']) ? 'hide' : 'show'}):
                </Label>
                <br/>
                <Collapse isOpen={this.state.opened.includes(review['@id'])}>
                { review.privateComment }
              </Collapse>
              </div>
                  </CardBody>
              </Card>
              )}
          </div>
          </>
      )
    }
  }
