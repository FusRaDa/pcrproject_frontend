import React, { useContext }from 'react'
import AuthContext from '../context/AuthContext'

//style
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container"


const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)

  return (
    <Container fluid>
  
    <Form onSubmit={loginUser}>
      <Row>

        <Col sx='auto'>
          <Form.Group>
            <Form.Control name='username' type='text' placeholder='Enter username' />
          </Form.Group>
        </Col>

        <Col sx='auto'>
          <Form.Group>
            <Form.Control name='password' type='password' placeholder='Enter password' />
          </Form.Group>
        </Col>

        <Col sx='auto'>
          <Button variant='primary' type='submit'>Login</Button>
        </Col>

      </Row>
    </Form>
  
    </Container>
  )
}

export default LoginPage