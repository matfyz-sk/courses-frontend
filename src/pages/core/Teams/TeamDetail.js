import React, { useState } from 'react'
import { Alert, Badge, Button, Col, Container, Form, Input, Row, Table, } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as ROUTES from '../../../constants/routes'
import { getUser, getUserID } from '../../../components/Auth'
import { redirect } from '../../../constants/redirect'
import withTeamHandler from './TeamDetailHOC'
import { getShortID } from '../../../helperFunctions'
import { isVisibleUser, showUserName } from '../../../components/Auth/userFunction';
import { CreateTeamForm } from './CreateTeamForm'
import { useGetUserQuery } from "services/user"
import { 
  useNewTeamInstanceMutation, 
  useUpdateTeamInstanceMutation,
  useDeleteTeamInstanceMutation,
  useDeleteTeamMutation 
} from "services/teamGraph"
import { skipToken } from '@reduxjs/toolkit/dist/query'

function TeamsDetail(props) {
  const {
    course_id, 
    history, 
    team,
    users, 
    create, 
    isAdmin, 
    privilegesReducer, 
    courseInstanceReducer
  } = props
  const {courseInstance} = courseInstanceReducer
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [searchUserRequestByEmail, setSearchUserRequestByEmail] = useState(skipToken)
  const [searchUserRequestByNickname, setSearchUserRequestByNickname] = useState(skipToken)
  const [newTeamInstance, newTeamInstanceResult] = useNewTeamInstanceMutation()
  const [updateTeamInstance, updateTeamInstanceResult] = useUpdateTeamInstanceMutation()
  const [removeTeam, removeTeamResult] = useDeleteTeamMutation()
  const [removeTeamInstance, removeTeamInstanceResult] = useDeleteTeamInstanceMutation()
  const {
    data: userByEmailData, 
    isSuccess: userByEmailIsSuccess
  } = useGetUserQuery(searchUserRequestByEmail)

  if (userByEmailIsSuccess && userByEmailData && userByEmailData.length > 0) { 
    appendUserToTeam(team['_id'], userByEmailData['_id'])
  } else {
    const {
      data: userByNicknameData, 
      isSuccess: userByNicknameIsSuccess
    } = useGetUserQuery(searchUserRequestByNickname)

    if (userByNicknameIsSuccess && userByNicknameData && userByNicknameData.length > 0) {
      appendUserToTeam(team['_id'], userByNicknameData['_id'])
    } else {
      setError('User was not found!')
    }
  }

  const searchUser = () => {
    if(search.length < 3) {
      setError('Minimal string length is 3')
      return
    }
    if(
      search.toLowerCase() === getUser().email.toLowerCase() ||
      search.toLowerCase() === getUser().nickname.toLowerCase()
    ) {
      setError('You cannot add yourself!')
      return
    }
    setSearchUserRequestByEmail({email: search, studentOfId: course_id})
    setSearchUserRequestByNickname({nickname: search, studentOfId: course_id})
  }

  const appendUserToTeam = (iri, user, approved = false, fillRequest = true) => {
    const post = {
      approved,
      instanceOf: iri,
      hasUser: user,
      requestFrom: fillRequest ? getUser().fullURI : null,
    }
    newTeamInstance(post).unwrap().then(response => {
      if(!response.status) {
        setError('Error has occured during saving process. Please, try again.')
      } else {
        history.push(
          redirect(ROUTES.COURSE_TEAM_DETAIL, [
            {key: 'course_id', value: course_id},
            {key: 'team_id', value: getShortID(iri)},
          ])
        )
      }
    }).catch(error => {
      setError('Error has occured during saving process. Please, try again.')
    })
  }

  const approveMember = (user) => {
    const id = user['_id']
    const body = {approved: true}
    updateTeamInstance({id, body}).unwrap().then(response => {
      history.push(
        redirect(ROUTES.COURSE_TEAM_DETAIL, [
          {key: 'course_id', value: course_id},
          {key: 'team_id', value: getShortID(team['_id'])},
        ])
      )
    }).catch(error => {
      throw new Error("Failed to approve user" + error)
    })
  }

  const removeMember = (user) => {
    if(users.length === 1 || !verifyRemoveUser(users, user)) {
      removeTheTeam()
    } else {
      removeUserFromTeam(user)
    }
  }

  const removeTheTeam = () => {
    for(let i = 0; i < users.length; i++) {
      removeUserFromTeam(users[i], false)
    }
    removeTeam(team['_id']).unwrap().then(response => {
      history.push(
        redirect(ROUTES.COURSE_TEAMS, [
          {key: 'course_id', value: course_id},
        ])
      )
    }).catch(error => {
      throw new Error("Failed to remove the team" + error)
    })
  }

  const removeUserFromTeam = (user, rerender = true) => {
    removeTeamInstance(user['_id']).unwrap().then(response => {
      if(rerender) {
        history.push(
          redirect(ROUTES.COURSE_TEAM_DETAIL, [
            {key: 'course_id', value: course_id},
            {key: 'team_id', value: getShortID(team['_id'])},
          ])
        )
      }
    }).catch(error => {
      throw new Error("Failed to remove the user from team" + error)
    })
  }

  const render_members = []
  let canEdit = false
  let isMember = false
  if(users) {
    for(let i = 0; i < users.length; i++) {
      if(getShortID(users[i].hasUser[0]['_id']) === getUserID()) {
        isMember = true
      }
      if(
        users[i].approved &&
        getShortID(users[i].hasUser[0]['_id']) === getUserID()
      ) {
        canEdit = true
      }
    }
    for(let i = 0; i < users.length; i++) {
      const user = users[i].hasUser[0]
      const action = []
      if(canEdit || isAdmin) {
        action.push(
          <Button
            color="danger"
            size="sm"
            title="Remove from team"
            onClick={ () => removeMember(users[i]) }
            key={ `remove-${ i }` }
          >
            &#215;
          </Button>
        )
      }
      if((canEdit || isAdmin) && !users[i].approved) {
        action.push(
          <Button
            color="success"
            onClick={ () => approveMember(users[i]) }
            size="sm"
            className="ml-1"
            title="Approve member"
            key={ `approve-${ i }` }
          >
            &#10003;
          </Button>
        )
      }
      render_members.push(
        <tr key={ `users-${ i }` }>
          <th scope="row">{
            (canEdit || isAdmin) && user.nickNameTeamException && users[i].approved ?
              `${ user.firstName } ${ user.lastName }`
              : showUserName(user, privilegesReducer, courseInstance)
          }</th>
          <td>
            <h5>
              <Badge color={ users[i].approved ? 'success' : 'danger' }>
                { users[i].approved ? 'approved' : 'not approved' }
              </Badge>
            </h5>
          </td>
          <td>{ action }</td>
          <td>
            { isVisibleUser(users[i].hasUser[0]) ? (
              <Link
                to={ redirect(ROUTES.PUBLIC_PROFILE, [
                  {
                    key: 'user_id',
                    value: getShortID(users[i].hasUser[0]['_id']),
                  },
                ]) }
              >
                DETAIL
              </Link>
            ) : null }
          </td>
        </tr>
      )
    }
  }

  return (
    <Container>
      <Row>
        <Col xs={ 12 }>
          { canEdit || isAdmin ? (
            <Button
              color="danger"
              size="sm"
              className="float-right"
              onClick={ removeTheTeam }
            >
              Remove team
            </Button>
          ) : null }
          <h1>{ create ? 'New team' : `Team ${ teamName }` }</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={ 12 } sm={ 6 } className="mt-4" key="members">
          { error ? <Alert color="danger">{ error }</Alert> : '' }
          <CreateTeamForm  
            course={courseInstance}
            create={create}
            teamName={teamName}
            setTeamName={setTeamName}
            setError={setError}
            appendUserToTeam={appendUserToTeam}
          />
          <Table hover responsive>
            <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
            </thead>
            <tbody>{ render_members }</tbody>
          </Table>
          { canEdit || isAdmin ? (
            <Form className="mt-5">
              <Input
                type="text"
                name="insert_request"
                id="insert_request"
                placeholder="email or nickName"
                onChange={ e => setSearch(e.target.value) }
              />
              <Button
                type="button"
                className="mt-3"
                onClick={ searchUser }
              >
                Send request
              </Button>
            </Form>
          ) : !isMember ? (
            <Button
              type="button"
              className="mt-3"
              onClick={ () =>
                appendUserToTeam(
                  team['_id'],
                  getUser().fullURI,
                  false,
                  false
                )
              }
            >
              Ask for join
            </Button>
          ) : null }
        </Col>
      </Row>
    </Container>
  )
}

const verifyRemoveUser = (users, user) => {
  let count = 0
  if(!user.approved) {
    return true
  }
  for(let i = 0; i < users.length; i++) {
    if(users[i].approved) {
      count += 1
    }
  }
  if(count - 1 === 0) {
    return false
  }
  return true
}

const mapStateToProps = state => {
  return state
}

export default withRouter(
  connect(mapStateToProps)(withTeamHandler(TeamsDetail))
)
