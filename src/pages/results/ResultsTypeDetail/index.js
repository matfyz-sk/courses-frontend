import React, { useEffect, useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table, FormGroup, Input, Alert, Button, Label } from 'reactstrap'
import withResultDetail from './withResultDetail'
import { redirect } from '../../../constants/redirect'
import {RESULT_DETAIL, RESULT_TYPE} from '../../../constants/routes';
import { formatDate } from '../../../functions/global'
import { showUserName } from '../../../components/Auth/userFunction'
import { getUser } from '../../../components/Auth'
import { getShortID, getFullID } from '../../../helperFunctions'
import { useGetResultQuery, useUpdateResultMutation, useNewResultMutation } from 'services/result'
import { useGetUserQuery } from 'services/user'

function ResultsTypeDetail(props) {
  const { canEdit, resultType, course_id, result_type_id, privileges, instance } = props
  const [users, setUsers] = useState(null)
  const [performUser, setPerformUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [extended, setExtended] = useState(false)
  const [updateUserResult, updateUserResultResult] = useUpdateResultMutation()
  const [newUserResult, newUserResultResult] = useNewResultMutation()
  const {
    data: usersData, 
    isSuccess: usersIsSuccess
  } = useGetUserQuery({studentOfId: getFullID(course_id, "courseInstance")})
  const {
    data: resultData, 
    isSuccess: resultIsSuccess
  } = useGetResultQuery({typeId: result_type_id})

  const getResultsData = (type_id, userList) => {
    if (resultIsSuccess && resultData) {
      const resultList = resultData
      const userWithResults = []
      for (let i = 0; i < userList.length; i++) {
        let result = null
        for (let j = 0; j < resultList.length; j++) {
          if (resultList[j].hasUser[0]['_id'] === userList[i]['_id']) {
            result = resultList[j]
            break
          }
        }
        if (result) {
          userWithResults.push({
            user: userList[i],
            result,
          })
        } else {
          userWithResults.push({
            user: userList[i],
            result: {
              courseInstance: instance['_id'],
              hasUser: userList[i]['_id'],
              awardedBy: getUser().fullURI,
              type: resultType['_id'],
              points: '',
              description: '',
              reference: '',
            },
          })
        }
      }
      setUsers(userWithResults)
      setPerformUser(JSON.parse(JSON.stringify(userWithResults)))
    }
  }

  const getUsers = () => {
    if(usersIsSuccess && usersData) {
      getResultsData(result_type_id, usersData)
    }
  }

  const checkPerformance = (i) => {
    return (
      `${users[i].result.points}` !== `${performUser[i].result.points}` ||
      users[i].result.description !== performUser[i].result.description ||
      users[i].result.reference !== performUser[i].result.reference
    )
  }

  const saveAll = () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].result.points !== '' && checkPerformance(i)) {
        if (users[i].result['_id']) {
          setMsg(`[ PROGRESS ] Creating results for students ...`)
          setLoading(true)
          const body = {
            points: users[i].result.points, 
            description: users[i].result.description, 
            reference: users[i].result.reference
          }
          updateUserResult({
            id: getShortID(users[i].result['_id']),
            body
          }).unwrap().then(response => {
            setPerformUser(JSON.parse(JSON.stringify(users)))
            setLoading(false)
            setMsg('Results has been saved!')
          })
        } else {
          setLoading(true)
          setMsg(`[ PROGRESS ] Creating results for students ...`)
          const post = {
            courseInstance: users[i].result.courseInstance,
            hasUser: users[i].result.hasUser,
            awardedBy: users[i].result.awardedBy,
            type: users[i].result.type,
            points: users[i].result.points,
            description: users[i].result.description,
            reference: users[i].result.reference
          }
          newUserResult(post).unwrap().then(response => {
            if (response) {
              const cUsers = [...users]
              cUsers[i].result = response[0]
              setUsers(cUsers)
              setPerformUser(JSON.parse(JSON.stringify(cUsers)))
              setLoading(false)
              setMsg('Results has been saved!')
            }
          })
        }
      }
    }
  }

  useEffect(() => {
    getUsers()
  }, [usersIsSuccess])

  let correctionHref = ''
  if (resultType.correctionFor) {
    correctionHref = (
      <>
        Correction for
        {' '}
        <Link
          to={redirect(RESULT_TYPE, [
            {
              key: 'course_id',
              value: course_id,
            },
            {
              key: 'result_type_id',
              value: getShortID(resultType.correctionFor['_id']),
            },
          ])}
        >
          {resultType.correctionFor.name}
        </Link>
      </>
    )
  }

  const renderUsers = []
  if (users) {
    for (let i = 0; i < users.length; i++) {
      renderUsers.push(
        <tr
          key={`users-${i}`}
          className={
            resultType.minPoints !== 0 &&
            users[i].result.points !== '' &&
            users[i].result.points < resultType.minPoints ? 'text-danger' : ''
          }
        >
          <th>{showUserName(users[i].user, privileges, instance)}</th>
          <td>
            {users[i].result && Array.isArray(users[i].result.awardedBy)
              ? `${users[i].result.awardedBy[0].firstName} ${users[i].result.awardedBy[0].lastName}`
              : '-'}
          </td>
          <td>{resultType.minPoints} p</td>
          {canEdit && extended ? (
            <>
              <td>
                <FormGroup className="m-0">
                  <Input
                    type="textarea"
                    name={`description-${i}`}
                    placeholder="describe your result"
                    bsSize="sm"
                    disabled={users[i].result.points === ''}
                    value={users[i].result.description}
                    onChange={e => {
                      const cUsers = [...users]
                      cUsers[i].result.description = e.target.value
                      setUsers(cUsers)
                    }}
                  />
                </FormGroup>
              </td>
              <td>
                <FormGroup className="m-0">
                  <Input
                    type="text"
                    name={`reference-${i}`}
                    placeholder="set reference"
                    bsSize="sm"
                    disabled={users[i].result.points === ''}
                    value={users[i].result.reference}
                    onChange={e => {
                      const cUsers = [...users]
                      cUsers[i].result.reference = e.target.value
                      setUsers(cUsers)
                    }}
                  />
                </FormGroup>
              </td>
            </>
          ) : null}
          <td style={{width: 90}}>
            {canEdit ? (
              <FormGroup className="m-0">
                <Input
                  type="number"
                  name="points"
                  placeholder="set points"
                  bsSize="sm"
                  value={users[i].result.points}
                  onChange={e => {
                    const cUsers = [...users]
                    cUsers[i].result.points = e.target.value
                    setUsers(cUsers)
                  }}
                />
              </FormGroup>
            ) : (
              <b>{users[i].result ? `${users[i].result.points} p` : '-'}</b>
            )}
          </td>
          <td>{users[i].result['_id'] ? (
              <Link
                to={redirect(RESULT_DETAIL, [
                  {
                    key: 'course_id',
                    value: course_id,
                  },
                  {
                    key: 'result_id',
                    value: getShortID(users[i].result['_id']),
                  },
                ])}
              >
                Detail
              </Link>
            ) : null}
          </td>
        </tr>
      )
    }
  }

  /*{`
        This type of result has been created by instructor ${resultType.createdBy.firstName} ${resultType.createdBy.lastName}
        on ${formatDate(resultType.createdAt)}.
        ${resultType.minPoints > 0 ? ` You need to earn at least ${resultType.minPoints} points to pass.` : ''}
        `}
  */

  return (
    <Container>
      <h1 className="mb-2">{resultType.name}</h1>
      <h3 className="text-muted mb-4">{correctionHref}</h3>
      {resultType.description ? <p>{resultType.description}</p> : ''}
      <Alert color="info" className="mt-3 mb-0">
        {/**/}
        {`
        ${resultType.minPoints > 0 ? ` You need to earn at least ${resultType.minPoints} points to pass.` : ''}
        `}
      </Alert>
      {msg ? <Alert color="success" className="mt-3">{msg}</Alert> : null}
      <Row>
        <Col sm={12} className="mt-4">
          {canEdit ? (
            <Button
              color="primary"
              size="sm"
              className="float-right mb-3"
              onClick={saveAll}
              disabled={!(renderUsers.length > 0 || loading)}
            >
              Save results
            </Button>
          ) : null}
          {canEdit && renderUsers.length > 0 ? (
            <FormGroup check className="w-50">
              <Label check>
                <Input
                  type="checkbox"
                  checked={extended}
                  onChange={() => setExtended(!extended)}
                /> Extend options
              </Label>
            </FormGroup>
          ) : null}
          <Table hover size="sm" responsive>
            <thead>
              <tr>
                <th>Student</th>
                <th>Awarded by</th>
                <th>Min. p</th>
                {extended && canEdit ? (
                  <>
                    <th>Description</th>
                    <th>Reference</th>
                  </>
                ) : null}
                <th>Earned p</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>{renderUsers}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ courseInstanceReducer, privilegesReducer }) => {
  const { courseInstance } = courseInstanceReducer
  const privileges = privilegesReducer
  return {
    courseInstance,
    privileges,
  }
}

export default withRouter(
  connect(mapStateToProps)(withResultDetail(ResultsTypeDetail))
)