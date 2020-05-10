import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Alert,
  Badge, Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Row,
} from 'reactstrap'
import { FiMail } from 'react-icons/fi'
import Avatar from '../../../images/avatar.png'
import withPublic from './withPublic'
import { showUserName } from '../../../components/Auth/userFunction'
import PrivateField from './PrivateField'
import EmptyField from './EmptyField'
import { COURSE_ID } from '../../../constants/routes'
import './assets/style.scss'
import { redirect } from '../../../constants/redirect'
import {getShortID} from "../../../helperFunctions";

const PublicProfile = ({
  user,
  user_id,
  privileges,
  role,
  courses,
  instruct,
  allowContact,
  showCourses,
  showBadges,
  ...props
}) => {
  return (
    <Container>
      <Row className="mt-5">
        <Col lg={3} sm={4} xs={12}>
          <div
            className="rounded-image mb-5"
            style={{
              backgroundImage: `url(${user.avatar ? user.avatar : Avatar})`,
            }}
          />
          <div className="">
            {allowContact ? (
              <Alert
                color="warning"
                style={{ padding: '8px 10px' }}
                className="text-center"
              >
                <h3 className="text-center">
                  <FiMail />
                </h3>
                Feel free to contact me
                <br />
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </Alert>
            ) : (
              <PrivateField name="Contact email" sm />
            )}
          </div>
        </Col>
        <Col sm={8} xs={12}>
          <h1>{showUserName(user, privileges)}</h1>
          <h4>
            <Badge color={role.color}>{role.name}</Badge>
          </h4>
          <div className="mt-4">
            <h5>About me</h5>
            {user.description && user.description.length > 0 ? (
              user.description
            ) : (
              <>
                Nothing much to say.
                {allowContact ? (
                  <>
                    &nbsp;Ask me for more information here&nbsp;
                    <a href={`mailto:${user.email}`}>{user.email}</a>.
                  </>
                ) : (
                  ''
                )}
              </>
            )}
          </div>
          <div className="mt-4">
            <h5>My courses</h5>
            {showCourses ? (
              <ShowList list={courses} />
            ) : (
              <PrivateField name="My courses" pl />
            )}
          </div>
          <div className="mt-4">
            <h5>My badges</h5>
            {showBadges ? <EmptyField /> : <PrivateField name="My badges" pl />}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

const ShowList = ({ list, ...props }) => {
  if(!list || list.length === 0) {
    return <EmptyField />
  } else {
    const renderList = []
    for (let i = 0; i < list.length; i++) {
      renderList.push(
        <ListGroupItem key={`list-${i}`}>
          <ListGroupItemHeading>
            <Link
              to={redirect(COURSE_ID, [
                { key: 'course_id', value: getShortID(list[i]['@id']) },
              ])}
            >
              {list[i].name}
            </Link>
          </ListGroupItemHeading>
          <ListGroupItemText>
            {list[i].description}
          </ListGroupItemText>
        </ListGroupItem>
      )
    }
    return <ListGroup className="mt-3">{renderList}</ListGroup>
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(withPublic(PublicProfile)))
