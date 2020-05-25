import React, { useEffect, useState } from 'react'
import {getUserResult, updateUserResult} from '../functions';
import {Alert, Button, Col, Container, FormGroup, Input, Row, Table} from "reactstrap";
import {redirect} from "../../../constants/redirect";
import {RESULT_TYPE} from "../../../constants/routes";
import {getShortID} from "../../../helperFunctions";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux"
import {showUserName} from "../../../components/Auth/userFunction";
import {formatDate} from "../../../functions/global";

const ResultDetail = props => {
  const { match, privileges } = props
  const { course_id, result_id } = match.params
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const canEdit =
    privileges.inGlobal === 'admin' ||
    privileges.inCourseInstance === 'instructor'

  function getDetail() {
    getUserResult(result_id, true).then(data => {
      if (data['@graph'] && data['@graph'].length > 0) {
        setResult(data['@graph'][0])
      }
    })
  }

  function saveChanges() {
    if (result.points && result.points !== '') {
      updateUserResult(result).then(data => {
        setLoading(false)
        setMsg('Result has been saved!')
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

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
            value: getShortID(result.type[0]['@id']),
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
      <h1 className="mb-2">{showUserName(result.hasUser[0], privileges)}</h1>
      <h3 className="text-muted mb-4">Result detail of {resultHref}</h3>
      <p>
        Awarded by {result.awardedBy[0].firstName} {result.awardedBy[0].lastName} on {formatDate(result.createdAt)}.
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
                  {!canEdit ? (
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
                  {!canEdit ? (
                    <FormGroup className="m-0">
                      <Input
                        type="text"
                        name="reference"
                        placeholder="set reference"
                        value={result.reference}
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
                  {!canEdit ? (
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
          {!canEdit ? (
            <Button
              color="primary"
              className="float-right"
              onClick={saveChanges}
            >
              Save changes
            </Button>
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

const mapStateToProps = ({ privilegesReducer }) => {
  const privileges = privilegesReducer
  return {
    privileges,
  }
}

export default withRouter(connect(mapStateToProps)(ResultDetail))
