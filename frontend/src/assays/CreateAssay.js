import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'

import AuthContext from "../context/AuthContext"
import AssayContext from "../context/AssayContext"
import ReagentContext from "../context/ReagentContext"

const CreateAssay = () => {
  let {authTokens} = useContext(AuthContext)
  let {assays, setUpdating} = useContext(AssayContext)
  let {reagents} = useContext(ReagentContext) 

  const navigate = useNavigate()

  let [individual, setIndividual] = useState(true)
  let [search, setSearch] = useState("")

  let [addedAssays, setAddedAssays] = useState([])
  let [addedReagents, setAddedReagents] = useState([])

  let [validated, setValidated] = useState(false)

  let addAssayToGroup = (assay) => {
    setAddedAssays(addedAssays => [...addedAssays, assay])
  }

  let removeAssayFromGroup = (assay) => {
    setAddedAssays(addedAssays => addedAssays.filter(a => a !== assay))
  }

  let addReagentToGroup = (reagent) => {
    setAddedReagents(addedReagents => [...addedReagents, reagent])
  }
  
  let removeReagentFromGroup = (reagent) => {
    setAddedReagents(addedReagents => addedReagents.filter(r => r !== reagent))
  }

  let addAssay = async (e) => {
    e.preventDefault()
    
    let data = {}

    //if form is for individual assay use this data, else use the latter data for group assays
    if (e.target.type !== undefined) {
      //individual assay
      data = {
        'name': e.target.name.value, 
        'code': e.target.code.value,
        'type': e.target.type.value,
        'reagent_ids': addedReagents.map(r => r.pk)
        //TODO
        // 'supply_ids': required,
      }
    } else {
      //group assay
      data = {
        'name': e.target.name.value, 
        'code': e.target.code.value,
        'assay_ids' : addedAssays.map(a => a.pk)
      }
    }
    
    let response = await fetch('http://127.0.0.1:8000/api/assays/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })
    if(response.status === 201) {
      console.log('assay created successfully')
      setUpdating(true)
      navigate('/assay')
    } else {
      // alert('error')
      setValidated(true)
    }
  }

  let searchBar = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  let handleSwitch = () => {
    setIndividual(!individual)
    setSearch("")
    setValidated(false)
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Button onClick={() => handleSwitch()}>{individual ? "Create Group Assay" : "Create Individual Assay"}</Button>

            {individual && 
            <Container>
              <Form noValidate validated={validated} onSubmit={addAssay}>
                <Form.Group>
                  <Form.Label>Assay Name</Form.Label>
                  <Form.Control required name="name" type="text" placeholder="Enter name of assay" />
                  <Form.Control.Feedback type='invalid'>Assay must have a name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Assay Code</Form.Label>
                  <Form.Control required name="code" type="text" placeholder="Enter code of assay" />
                  <Form.Control.Feedback type='invalid'>Assay must have a code.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Assay Type</Form.Label>
                  <Form.Select required name="type">
                    <option value="">Select Type</option>
                    <option value="DNA">DNA</option>
                    <option value="RNA">RNA</option>
                    <option value="Total nucleic">Total nucleic</option>
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>Choose a type.</Form.Control.Feedback>
                </Form.Group>

                <Card bg='primary' text='light' style={{marginTop: '10px'}}>
                  <Card.Header>Added Reagents</Card.Header>
                  <ListGroup>
                    {addedReagents.map(reagent => (
                      <ListGroup.Item variant="secondary" action key={reagent.pk} onClick={() => removeReagentFromGroup(reagent)}>
                        {`${reagent.catalogNumber}-${reagent.name}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>

                {addedReagents.length > 0 && <Button type="submit">Add Assay</Button>}
              </Form>
            </Container>}

            {!individual && 
            <Container>
              <Form noValidate validated={validated} onSubmit={addAssay}>
                <Form.Group>
                  <Form.Label>Assay Name</Form.Label>
                  <Form.Control required name="name" type="text" placeholder="Enter name of assay" />
                  <Form.Control.Feedback type='invalid'>Assay must have a name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Assay Code</Form.Label>
                  <Form.Control required name="code" type="text" placeholder="Enter code of assay" />
                  <Form.Control.Feedback type='invalid'>Assay must have a code.</Form.Control.Feedback>
                </Form.Group>

                <Card bg='primary' text='light' style={{marginTop: '10px'}}>
                  <Card.Header>Grouped Assays</Card.Header>
                  <ListGroup>
                    {addedAssays.map(assay => (
                      <ListGroup.Item variant="secondary" action key={assay.pk} onClick={() => removeAssayFromGroup(assay)}>
                        {`${assay.code}-${assay.name}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
                {addedAssays.length > 1 && <Button type="submit">Add Assay</Button>}
              </Form>
            </Container>}
        </Col>

        <Col>
          {individual && 
          <Container>
            <Card bg='primary' text='light'>
            <Card.Header>Reagents</Card.Header>
              <Form onChange={() => searchBar()}>
                <Form.Control
                  type='search'
                  placeholder="Search for Reagents to Add to Assay"
                  id="search"/>
              </Form>

              <ListGroup>
                {reagents
                  .filter(reagent => !addedReagents.includes(reagent))
                  .filter(reagent => search !== null ? reagent.name.toLowerCase().includes(search) || reagent.catalogNumber.includes(search) : reagent)
                  .map(reagent => (
                    <ListGroup.Item variant="secondary" key={reagent.pk} action onClick={() => addReagentToGroup(reagent)}>
                      {`${reagent.catalogNumber}-${reagent.name}`}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card>
          </Container>}

          {!individual && 
          <Container>
            <Card bg='primary' text='light'>
              <Card.Header>Individual Assays</Card.Header>
              <Form className="d-flex" onChange={() => searchBar()}>
                <Form.Control
                  type="search"
                  placeholder="Search for Individual Assays to Group Together"
                  id="search"
                />
              </Form>
          
              <ListGroup>
                {assays
                  //allow assays clicked to be edited/details and added to group assay
                  .filter(assay => assay.assay.length === 0)
                  .filter(assay => !addedAssays.includes(assay))
                  .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
                  .map(assay => (
                    <ListGroup.Item variant="secondary" key={assay.pk} action onClick={() => addAssayToGroup(assay)}>
                      {`${assay.code}-${assay.name}`}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card>
          </Container>}

       
        </Col>
      </Row>
    </Container>
  )
}

export default CreateAssay