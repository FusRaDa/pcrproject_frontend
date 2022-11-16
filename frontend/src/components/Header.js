import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from "react-bootstrap/Container";

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)

  return (
    <Container fluid>
      <Row>

        {user ? (
          <Col>
            <p onClick={logoutUser}>Logout</p>
            <Link to="/">Home</Link>
            <span> | </span>
            <Link to="/assay">Assays</Link>
          </Col>

        ): (
          <Link to="/login">Login</Link>
        )}
    
        {user && <p>Hello {user.username}</p>}

      </Row>
     
    </Container>
  )
}

export default Header