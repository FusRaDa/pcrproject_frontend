import React from "react"

//style
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'


const WelcomePage = () => {
  return(
    <Container>
      <Row style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>

    
          <Card bg='warning' border="warning" style={{ width: '25rem', marginRight: '100px' }}>
            <Card.Header>Frontend Features</Card.Header>
            <ListGroup style={{marginBottom: '20px'}}>
              <ListGroup.Item><a href="https://github.com/FusRaDa/pcrproject_frontend" target="_blank" rel="noopener noreferrer">Frontend Code</a></ListGroup.Item>
              <ListGroup.Item>React.js</ListGroup.Item>
              <ListGroup.Item>Styling with React-Bootstrap</ListGroup.Item>
              <ListGroup.Item>Dynamic and Interactive Table with React-Table</ListGroup.Item>
              <ListGroup.Item>Local Storage for Saving User Preferences</ListGroup.Item>
              <ListGroup.Item>Form Validation for User Experience</ListGroup.Item>
            </ListGroup>
          </Card>
     
          <Card bg='primary' border="info" style={{ width: '25rem' }}>
            <Card.Header>Backend Features</Card.Header>
            <ListGroup style={{marginBottom: '20px'}}>
              <ListGroup.Item><a href="https://github.com/FusRaDa/pcrproject_backend" target="_blank" rel="noopener noreferrer">Backend Code</a></ListGroup.Item>
              <ListGroup.Item>Django Rest Framework</ListGroup.Item>
              <ListGroup.Item>JSON Web Tokens Authentication</ListGroup.Item>
              <ListGroup.Item>CRUD Operations</ListGroup.Item>
              <ListGroup.Item>ForeignKey and ManytoMany Table Relations</ListGroup.Item>
              <ListGroup.Item>User Permissions</ListGroup.Item>
              <ListGroup.Item>Validation of Information and Security</ListGroup.Item>
            </ListGroup>
          </Card>
      

      </Row>
    </Container>
  )
}

export default WelcomePage