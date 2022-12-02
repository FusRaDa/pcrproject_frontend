import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

//components
import AuthContext from "../context/AuthContext"
import AssayContext from "../context/AssayContext"
import ReagentContext from "../context/ReagentContext"
import ServerAddress from "../ServerAddress"

//style
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Offcanvas from 'react-bootstrap/Offcanvas'


const CreateAssay = () => {
  let {authTokens} = useContext(AuthContext)
  let {assays, setUpdating} = useContext(AssayContext)
  let {reagents} = useContext(ReagentContext) 

  const navigate = useNavigate()

  let [individual, setIndividual] = useState(true)
  let [search, setSearch] = useState("")

  let [guide, setGuide] = useState(true)

  let [addedAssays, setAddedAssays] = useState([])
  let [addedReagents, setAddedReagents] = useState([])

  //validations
  let [nameValidated, setNameValidated] = useState(false)
  let [uniqueErrorName, setUniqueErrorName] = useState(false)
  let [codeValidated, setCodeValidated] = useState(false)
  let [uniqueErrorCode, setUniqueErrorCode] = useState(false)
  let [typeValidated, setTypeValidated] = useState(false)
 

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

  useEffect(() => {
    resetAllValidations()
    setAddedAssays([])
    setAddedReagents([])
  }, [individual])

  let resetAllValidations = () => {
    setNameValidated(false)
    setUniqueErrorName(false)
    setCodeValidated(false)
    setUniqueErrorCode(false)
    setTypeValidated(false)
  }

  let validateName = (str) => {
    if (str === "") {
      return false
    } 
    return true
  }

  let validateCode = (str) => {
    if (str === "") {
      return false
    }
    return true
  }

  let validateType = (str) => {
    if (str === "") {
      return false
    }
    return true
  }

  let addAssay = async (e) => {
    e.preventDefault()
    resetAllValidations()

    let validationFailed = false

    if (!validateName(e.target.name.value)) {
      setNameValidated(true)
      validationFailed = true
    }

    if (!validateCode(e.target.code.value)) {
      setCodeValidated(true)
      validationFailed = true
    }

    if (e.target.type !== undefined && !validateType(e.target.type.value)) {
      setTypeValidated(true)
      validationFailed = true
    }

    if (validationFailed) {
      return
    }
    
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

    let response = await fetch(`${ServerAddress}/api/assays/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })

    if (response.status === 201) {
      console.log('assay created successfully')
      setUpdating(true)
      navigate('/assay')
    } 

    if (response.status === 400) {
      let errorMessage = await response.json()

      if (errorMessage.name) {
        setUniqueErrorName(true)
        setNameValidated(true)
      }

      if (errorMessage.code) {
        setUniqueErrorCode(true)
        setCodeValidated(true)
      }
    }
  }

  let searchBar = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  let handleSwitch = () => {
    setIndividual(!individual)
    setSearch("")
  }

  const handleClose = () => setGuide(false);
  const handleShow = () => setGuide(true);

  return (
    <Container fluid>

      <Row style={{marginTop: '5px'}}>
        <Col>
          <Button variant="danger" onClick={() => navigate('/assay')}>Cancel</Button>
          <Button onClick={() => handleSwitch()}>{individual ? "Create Group Assay" : "Create Individual Assay"}</Button>
        </Col>

        <Col style={{display: 'flex', justifyContent: 'right'}}>
          <Button variant='warning' style={{position: 'fixed'}} onClick={handleShow}>
            Guide
          </Button>
        </Col>
      </Row>

      <Offcanvas placement='end' show={guide} onHide={handleClose} backdrop={false} scroll={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Step-by-step Guide - Create an Assay</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <p>This page allows you to create an assay.</p>

          <h5>Step: 1 - Create an Individual Assay</h5>
          <ol>
            <li>Individual assays only contain a list of reagents.</li>
            <li>Enter assay name, code, and type. Assay name and code must be unique for all assays.</li>
            <li>Select reagents to add from the reagents list on the right.</li>
            <li>Remove selected reagents by clicking on the added reagents list on the left.</li>
          </ol> 

          <h5>Step: 2 - Create a Group Assay</h5>
          <ol>
            <li>Group assays only contain a list of individual assays.</li>
            <li>Enter assay name and code. Assay name and code must be unique for all assays.</li>
            <li>Select individual assays to add from the assay list on the right.</li>
            <li>Remove selected individual assay by clicking on the added assays list on the left.</li>
          </ol> 

          <h5>Step: 3 - Add Assay</h5>
          <ol>
            <li>Click Add Assay after adding at least one reagent for an individual assay.</li>
            <li>Click Add Assay after adding at least two indiviudal assays for a group assay.</li>
          </ol> 

        </Offcanvas.Body>
      </Offcanvas>
   
      <Card style={{marginTop: '5px'}}>
        <Card.Header style={{backgroundColor: '#0D6EFD', textAlign: 'center', color: '#FFFFFF'}}>{individual ? "Creating an Individual Assay..." : "Creating a Grouped Assay..."}</Card.Header>
        <Card.Body>
          <Row>
            <Col>

              {individual && 
              <Container>
                <Form noValidate onSubmit={addAssay}>
                  <Form.Group>
                    <Form.Label>Assay Name</Form.Label>
                    <Form.Control required isInvalid={nameValidated} name="name" type="text" placeholder="Enter name of assay"/>
                    <Form.Control.Feedback type='invalid'>{nameValidated && !uniqueErrorName ? "Assay must have a name." : "Assay with this name already exists."}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Assay Code</Form.Label>
                    <Form.Control required isInvalid={codeValidated} name="code" type="text" placeholder="Enter code of assay" />
                    <Form.Control.Feedback type='invalid'>{codeValidated && !uniqueErrorCode ? "Assay must have a code." : "Assay with this code already exists."}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Assay Type</Form.Label>
                    <Form.Select isInvalid={typeValidated} required name="type">
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
                <Form noValidate onSubmit={addAssay}>
                  <Form.Group>
                    <Form.Label>Assay Name</Form.Label>
                    <Form.Control isInvalid={nameValidated} required name="name" type="text" placeholder="Enter name of assay" />
                    <Form.Control.Feedback type='invalid'>Assay must have a name.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Assay Code</Form.Label>
                    <Form.Control isInvalid={codeValidated} required name="code" type="text" placeholder="Enter code of assay" />
                    <Form.Control.Feedback type='invalid'>Assay must have a code.</Form.Control.Feedback>
                  </Form.Group>

                  <Card bg='primary' text='light' style={{marginTop: '10px'}}>
                    <Card.Header>Added Assays</Card.Header>
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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CreateAssay