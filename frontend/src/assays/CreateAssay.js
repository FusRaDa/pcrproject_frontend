import React, { useContext, useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup';
import AuthContext from "../context/AuthContext"
import Button from "react-bootstrap/Button";

const CreateAssay = ({isGroup, setIsGroup, addedAssays, setAddedAssays, pkArray, setPkArray}) => {
  let {authTokens} = useContext(AuthContext)

  let addAssay = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/assays/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'name':e.target.name.value, 'code':e.target.code.value})
    })
    if(response.status === 201) {
      console.log('assay created successfully')
    } else {
      alert('error')
    }
  }


  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Button onClick={() => setIsGroup(!isGroup)}>{!isGroup ? "Create Group Assay" : "Create Individual Assay"}</Button>
          <Form>
            <Form.Group>
              <Form.Label>{!isGroup ? "Individual Assay Name" : "Group Assay Name"}</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group>
              <Form.Label>{!isGroup ? "Individual Assay Code" : "Group Assay Code"}</Form.Label>
              <Form.Control />
            </Form.Group>

            {!isGroup && <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select>
                <option>Choose Sample Type</option>
                <option>DNA</option>
                <option>RNA</option>
                <option>Total nucleic</option>
              </Form.Select>
            </Form.Group>}
          </Form>


          {isGroup && <ListGroup>
            <Form.Label>Assays in Group </Form.Label>
            {addedAssays.map(assay => (
              <ListGroup.Item>{`${assay.code}-${assay.name}`}</ListGroup.Item>
            ))}
          </ListGroup>}





         
        </Col>
      </Row>
    </Container>
  )
}

export default CreateAssay