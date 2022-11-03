import React, { useContext, useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

import AuthContext from "../context/AuthContext"
import Button from "react-bootstrap/Button"
import AssayContext from "../context/AssayContext"

const CreateAssay = () => {
  let {authTokens} = useContext(AuthContext)
  let {assays} = useContext(AssayContext)

  let [individual, setIndividual] = useState(true)
  let [search, setSearch] = useState("")

  let [addedAssays, setAddedAssays] = useState([])

  let addAssayToGroup = (assay) => {
    setAddedAssays(addedAssays => [...addedAssays, assay])
  }

  let removeAssayFromGroup = (assay) => {
    setAddedAssays(addedAssays => addedAssays.filter(a => a !== assay))
  }

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

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Container>
            <Button onClick={() => setIndividual(!individual)}>{individual ? "Create Group Assay" : "Create Individual Assay"}</Button>

            {individual && 
            <Form>
              <Form.Group>
                <Form.Label>Assay Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name of assay" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Assay Code</Form.Label>
                <Form.Control type="text" placeholder="Enter code of assay" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Assay Type</Form.Label>
                <Form.Select>
                  <option>Select Type</option>
                  <option>DNA</option>
                  <option>RNA</option>
                  <option>Total nucleic</option>
                </Form.Select>
                Refer to a list of reagents and supplies and add to assay
              </Form.Group>
            </Form>}

            {!individual && 
            <Form>
              <Form.Group>
                <Form.Label>Assay Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name of assay" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Assay Code</Form.Label>
                <Form.Control type="text" placeholder="Enter code of assay" />
              </Form.Group>
              <ListGroup>
                {addedAssays.length > 0 ? "Grouped Assays" : null}
                {addedAssays.map(assay => (
                  <ListGroup.Item action key={assay.pk} onClick={() => removeAssayFromGroup(assay)}>
                    {`${assay.code}-${assay.name}`}
                  </ListGroup.Item>
                ))}
              </ListGroup>



            </Form>}
          </Container>
        </Col>



        <Col>

          {!individual && <Container>
            <Form className="d-flex" onChange={() => searchAssay()}>
              <Form.Control
                type="search"
                placeholder="Search for Individual Assays"
                id="search"
              />
            </Form>

            <ListGroup>
              {assays
                //allow assays clicked to be edited/details and added to group assay
                .filter(assay => assay.group.length === 0)
                .filter(assay => !addedAssays.includes(assay))
                .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
                .map(assay => (
                  <ListGroup.Item key={assay.pk} action onClick={() => addAssayToGroup(assay)}>
                    {`${assay.code}-${assay.name}`}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Container>}

       
        </Col>
      </Row>
    </Container>
  )
}

export default CreateAssay