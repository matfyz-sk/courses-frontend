import React from 'react'
import { Alert, Table, Row, Col } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ResultTypeModal from '../ResultTypeModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_TYPE } from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import { useGetAllResultTypesQuery } from 'services/result'

const ResultTypes = props => {
  const { courseInstanceReducer } = props
  const { courseInstance } = courseInstanceReducer
  const courseInstanceId = !courseInstance ? "" : courseInstance._id
  const { data } = useGetAllResultTypesQuery(courseInstanceId, {
    skip: !courseInstance,
  }) 

  return (
    <>
    <Row>
      <Col xs="auto"><h2 className="mb-4 mt-4">Result types</h2>
      </Col>
      <Col className="mb-4 mt-4"><ResultTypeModal  data={data}/>
      </Col>
      
      
    </Row>
      
      <Table hover size="sm" responsive>
        <thead>
          <tr className="border-bottom">
            <th>Name</th>
            <th>Min points</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {data && data[0].hasResultType.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <Alert color="info">No result type was set</Alert>
              </td>
            </tr>
          ) : (
            <>
              {
                !data ? 
                <tr>
                  <td colSpan={4}>
                    <Alert color="info">Loading...</Alert>
                  </td>
                </tr>
                : data[0].hasResultType.map((item) => <tr className="border-bottom" key={`grading-list-${item['_id']}`}>
                <th>{item.name}</th>
                <td>{item.minPoints}</td>
                <td className="text-right">
                  <ResultTypeModal resultType={item} data={data} />
                  {courseInstance ? (
                    <Link
                      to={redirect(RESULT_TYPE, [
                        {
                          key: 'course_id',
                          value: getShortID(courseInstance['_id']),
                        },
                        { key: 'result_type_id', value: getShortID(item['_id']) },
                      ])}
                      className="btn btn-sm btn-link ml-2"
                    >
                      Points
                    </Link>
                  ) : null}
                </td>
                </tr>)
              }
            </>
          )}
        </tbody>
      </Table>
    </>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(ResultTypes))
