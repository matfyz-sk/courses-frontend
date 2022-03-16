import React from 'react'
import { Link } from 'react-router-dom'
import {Card, CardBody, Container} from 'reactstrap'
import './ErrorStyle.css';

const Page401 = () => (
  <Container className="container-view">
    <Card className="error-card">
      <h1>401 - access denied</h1>
      <Link to="/" className="error-link">Take me home</Link>
    </Card>
  </Container>
)

export default Page401
