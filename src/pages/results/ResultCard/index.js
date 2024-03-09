import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { formatDate } from '../../../functions/global'


function ResultCard(props) {
    const { result } = props
    const form = {
      id: result? result._id : "",
      type: result? result.type : "",
      points: result? result.points : 0,
      description: result? result.description : "",
      reference: "",
      awardedBy: result? result.awardedBy.lastName : "",
      createdAt: result? formatDate(result.createdAt.representation) : "",
    } 


    form.reference = result && result.reference? <a className="ml-2" href= {"https://" + result.reference}>{result.reference}</a> : ""
    
    //console.log("Result: " + JSON.stringify(result))
    return (
        <>
        <div className="card mt-3 mb-3 ml-1 mr-1">
            <div className="card-header">
                <h5 style={{float: `left`}}>{form.points} points</h5>
            </div>
            <div className="card-body">
                {result.description}
            </div>
            <div className="card-footer text-end" color='secondary'>
                <div className="row g-0">
                    <div className="col-md-6">
                      Awarded by {form.awardedBy} - {form.createdAt}
                    </div>
                    <div className="col-md-6">
                      {form.reference? <div className='row'><p>See:</p> {form.reference}</div>:""}
                    </div>
                </div>
            </div>
        </div>
        </>
      )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
    const { courseInstance } = courseInstanceReducer
    return {
      courseInstance,
    }
  }
  
  export default withRouter(connect(mapStateToProps)(ResultCard))