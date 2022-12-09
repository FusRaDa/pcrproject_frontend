import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const ErrorPage = () => {

  return (
    <Container fluid>
      <Row>
        <Col>
        </Col>
        <Col style={{textAlign: 'center'}}>
          <h1>Server is Offline</h1>
          <h5>Log in again to check connection</h5>
        </Col>
        <Col>
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorPage