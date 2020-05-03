import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Container } from 'reactstrap'

const Page404 = () => (
  <Container className="container-view">
    <Card className="error-card">
      <h1>404 - page not found</h1>
      <Link to="/" className="error-link">
        Take me home
      </Link>
    </Card>
  </Container>
)

export default Page404
