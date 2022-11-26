import React from "react"
import { Link } from "react-router-dom"

//style
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'


const WelcomePage = () => {
  return(
    <Container>
      <Row>

        <Col>
          <Card border="warning" style={{ width: '18rem' }}>
            <Card.Header>Frontend Features</Card.Header>
            <ListGroup>
              <ListGroup.Item><Link to="https://github.com/FusRaDa/pcrproject_frontend">Frontend Code</Link></ListGroup.Item>
              <ListGroup.Item>React.js</ListGroup.Item>
              <ListGroup.Item>Styling with React-Bootstrap</ListGroup.Item>
              <ListGroup.Item>Dynamic and Interactive Table with React-Table</ListGroup.Item>
              <ListGroup.Item>Local Storage for Saving User Preferences</ListGroup.Item>
              <ListGroup.Item>Form Validation for User Experience</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col>
          <Card border="info" style={{ width: '18rem' }}>
            <Card.Header>Backend Features</Card.Header>
            <ListGroup>
              <ListGroup.Item>Django Rest Framework</ListGroup.Item>
              <ListGroup.Item><Link to="https://github.com/FusRaDa/pcrproject_backend">Backend Code</Link></ListGroup.Item>
              <ListGroup.Item>JSON Web Tokens Authentication</ListGroup.Item>
              <ListGroup.Item>CRUD Operations</ListGroup.Item>
              <ListGroup.Item>ForeignKey and ManytoMany Table Relations</ListGroup.Item>
              <ListGroup.Item>User Permissions</ListGroup.Item>
              <ListGroup.Item>Validation of Information and Security</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default WelcomePage