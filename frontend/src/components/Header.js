import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'

//components
import AuthContext from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'

//style
import Container from "react-bootstrap/Container"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'


const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)

  const navigate = useNavigate()

  return (
    <Navbar bg="light" expand="lg" >
      <Container fluid>
       
        <Navbar.Brand href='#home'>PCR Project by Matthew Rada</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
           
              {user ? (
                <Nav>
                  <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                  <Nav.Link onClick={() => navigate('/assay')}>Assays</Nav.Link>
                  <Nav.Link onClick={logoutUser}>Logout</Nav.Link>
                </Nav>
         
              ): (
                <Nav>
                  <LoginPage/>
                </Nav>
              )}

          </Navbar.Collapse>

          {user && <Navbar.Text>{`Logged in as: ${user.username}`}</Navbar.Text>}
        
      </Container>
    </Navbar>
  )
}

export default Header