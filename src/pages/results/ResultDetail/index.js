import React, { useEffect, useState } from 'react'
import {Alert, Button, Col, Container, FormGroup, Input, Row, Table} from "reactstrap";
import {redirect} from "../../../constants/redirect";
import {RESULT_TYPE, RESULT_USER} from "../../../constants/routes";
import {getShortID, getFullID} from "../../../helperFunctions";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux"
import {showUserName} from "../../../components/Auth/userFunction";
import {formatDate} from "../../../functions/global";
import { 
  useGetResultQuery, 
  useUpdateResultMutation,
  useDeleteResultMutation 
} from "services/result"
import { 
  useGetUserQuery
} from "services/user"
import { getUser } from 'components/Auth';

function ResultDetail(props) {
  const { match, privileges, history, courseInstance } = props
  const { course_id, result_id, user_id } = match.params
  const [result, setResult] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const canEdit =
    privileges.inGlobal === 'admin' ||
    privileges.inCourseInstance === 'instructor'
  const [updateUserResult, updateUserResultResult] = useUpdateResultMutation()
  const [deleteUserResult, deleteUserResultResult] = useDeleteResultMutation()
  const {
    data: resultData, 
    isSuccess: isResultSuccess,
    error: resultError
  } = useGetResultQuery({id: getFullID(result_id, "result")})
  const {
    data: userData, 
    isSuccess: isUserSuccess, 
    error: userError
  } = useGetUserQuery({id: getFullID(user_id, "user")}, {skip: !user_id})


  console.log("MATCH.PARAMS: " + JSON.stringify(match.params))

  const getDetail = () => {
    if (isResultSuccess && resultData && resultData.length > 0) {
      setResult(resultData[0])
    }
  }

  const getUserDetail = () => {
    if (isUserSuccess && userData && userData.length > 0){
      setUser(userData[0])
    }
  }

  const saveChanges = () => {
    if (result.points && result.points !== '') {
      updateUserResult({
        id: result['_id'],
        body: result
      }).unwrap().then(response => {
        setLoading(false)
        setMsg('Result has been saved!')
      })
    }
  }

  const removeResult = () => {
    const user_id = result.hasUser[0]['_id']
    deleteUserResult(user_id).unwrap().then(response => {
      history.push(
        redirect(RESULT_USER, [
          { key: 'course_id', value: course_id },
          { key: 'user_id', value: user_id },
        ])
      )
    })
  }

  useEffect(() => {
    getDetail()
    getUserDetail()
  }, [isResultSuccess, isUserSuccess])

  if (!result) {
    return null
  }

  let resultHref = ''
  const hasResultType = result.type && result.type.length > 0
  if (hasResultType) {
    resultHref = (
      <Link
        to={redirect(RESULT_TYPE, [
          {
            key: 'course_id',
            value: course_id,
          },
          {
            key: 'result_type_id',
            value: getShortID(result.type[0]['_id']),
          },
        ])}
      >
        {result.type[0].name}
      </Link>
    )
  }

  const renderRef = result.reference ? <a href={result.reference}>{result.reference}</a> : '-'
  const renderDesc = result.description ? result.description : '-'

  return (
    <Container>
      <h1 className="mb-2">{showUserName(user, privileges, courseInstance)}</h1>
      {resultHref !== '' ? (
        <h3 className="text-muted mb-4">{resultHref}</h3>
      ) : null}
      <p>
        Awarded by {result.awardedBy.firstName} {result.awardedBy.lastName} on {formatDate(result.createdAt.representation)}.
      </p>
      {hasResultType && result.type[0].minPoints > 0 ? (
        <Alert
          className="mt-3 mb-3"
          color={
            result.type[0].minPoints > result.points ? 'danger' : 'success'
          }
        >
          {result.type[0].minPoints > result.points
            ? `${result.type[0].name} was not passed!`
            : `${result.type[0].name} was passed! Well done.`}
        </Alert>
      ) : null}
      {msg ? <Alert color="success" className="mb-3">{msg}</Alert> : null}
      <Row>
        <Col md={6} sm={12}>
          <h5>Result detail</h5>
          <Table hover size="lg" responsive>
            <tbody>
              <tr>
                <td>Required points</td>
                <td>
                  {hasResultType ? result.type[0].minPoints : 'not defined'}
                </td>
              </tr>
              <tr>
                <td>Earned points</td>
                <th>
                  {canEdit ? (
                    <FormGroup className="m-0">
                      <Input
                        type="number"
                        name="points"
                        placeholder="set points"
                        value={result.points}
                        onChange={e => {
                          setResult({
                            ...result,
                            points: e.target.value,
                          })
                        }}
                      />
                    </FormGroup>
                  ) : (
                    result.points
                  )}
                </th>
              </tr>
              <tr>
                <td>Reference</td>
                <td>
                  {canEdit ? (
                    <FormGroup className="m-0">
                      <Input
                        type="text"
                        name="reference"
                        placeholder="set reference"
                        value={result.reference ? result.reference : ""}
                        onChange={e => {
                          setResult({
                            ...result,
                            reference: e.target.value,
                          })
                        }}
                      />
                    </FormGroup>
                  ) : (
                    renderRef
                  )}
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  {canEdit ? (
                    <FormGroup className="m-0">
                      <Input
                        type="textarea"
                        name="description"
                        placeholder="describe your result"
                        value={result.description}
                        onChange={e => {
                          setResult({
                            ...result,
                            description: e.target.value,
                          })
                        }}
                      />
                    </FormGroup>
                  ) : (
                    renderDesc
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          {canEdit ? (
            <>
              <Button
                color="danger"
                className="float-left"
                onClick={removeResult}
                disabled={loading}
              >
                Remove result
              </Button>
              <Button
                color="primary"
                className="float-right"
                onClick={saveChanges}
                disabled={loading}
              >
                Save changes
              </Button>
            </>
          ) : null}
        </Col>
        {hasResultType ? (
          <Col md={6} sm={12} className="d-none d-md-block">
            <h5>Result type description</h5>
            <p>
              {result.type[0].description ? result.type[0].description : ''}
            </p>
          </Col>
        ) : null}
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ privilegesReducer, courseInstanceReducer }) => {
  const privileges = privilegesReducer
  const { courseInstance } = courseInstanceReducer
  return {
    privileges,
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(ResultDetail))
