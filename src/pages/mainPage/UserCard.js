import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardText, Col } from 'reactstrap'
import { showUserName, textLimiter } from '../../components/Auth/userFunction'
import Avatar from '../../images/avatar.png'
import { redirect } from '../../constants/redirect'
import * as ROUTES from '../../constants/routes'
import {getShortID} from "../../helperFunctions";

const UserCard = ({ user, privileges }) => (
  <Col lg={2} md={3} sm={4} xs={6} className="mb-4">
    <Card className="p-2 border-0">
      <div
        className="rounded-image"
        style={{
          backgroundImage: `url(${user.avatar ? user.avatar : Avatar})`,
        }}
      />
      <CardBody style={{ padding: '25px 0' }}>
        <CardTitle>{showUserName(user, privileges)}</CardTitle>
        <CardText>{textLimiter(user.description)}</CardText>
        <Link to={redirect(ROUTES.PUBLIC_PROFILE, [{ key: 'user_id', value: getShortID(user['@id']) }])}>
          Show more
        </Link>
      </CardBody>
    </Card>
  </Col>
)

export default UserCard
