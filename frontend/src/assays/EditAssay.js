import React, { useContext, useState } from "react"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

//components
import AuthContext from "../context/AuthContext"
import AssayContext from "../context/AssayContext"
import ReagentContext from "../context/ReagentContext"
import ServerAddress from "../ServerAddress"

//style
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/esm/Row"
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Offcanvas from 'react-bootstrap/Offcanvas'



const EditAssay = () => {

  const location = useLocation()

  const navigate = useNavigate()

  let {authTokens} = useContext(AuthContext)
  let {assays, setUpdating} = useContext(AssayContext)
  let {reagents} = useContext(ReagentContext)

  let [search, setSearch] = useState("")
  let [addedAssays, setAddedAssays] = useState(location.state.assay.assay)
  let [addedReagents, setAddedReagents] = useState(location.state.assay.reagent)

  let [guide, setGuide] = useState(true)

  let [nameValidated, setNameValidated] = useState(false)
  let [uniqueErrorName, setUniqueErrorName] = useState(false)
  let [codeValidated, setCodeValidated] = useState(false)
  let [uniqueErrorCode, setUniqueErrorCode] = useState(false)

  let resetAllValidations = () => {
    setNameValidated(false)
    setUniqueErrorName(false)
    setCodeValidated(false)
    setUniqueErrorCode(false)
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

  let updateAssay = async (e) => {
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

    if (validationFailed) {
      return
    }

    let data = {}

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

    let response = await fetch(`${ServerAddress}/api/assays/${location.state.assay.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })

    if (response.status === 200) {
      console.log('batch updated')
      setUpdating(true)
      navigate('/assay')
    } 

    if (response.status === 400) {
      let errorMessage = await response.json()

      //refer to update serializer in AssaySerializer
      if (errorMessage.name) {
        setNameValidated(true)
        setUniqueErrorName(true)
      }

      if (errorMessage.code) {
        setCodeValidated(true)
        setUniqueErrorCode(true)
      }
      
    }
  } 

  let deleteAssay = async () => {
    let response = await fetch(`${ServerAddress}/api/assays/${location.state.assay.pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 204) {
      console.log('batch deleted')
      setUpdating(true)
      navigate('/assay')
    } else {
      alert('error')
    }
  }

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

  let searchBar = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  const handleClose = () => setGuide(false);
  const handleShow = () => setGuide(true);
  

  return (
    <Container fluid>
      <Row>
        <Col>
          <Button variant="danger" onClick={() => navigate('/assay')}>Cancel</Button>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'right'}}>
          <Button variant='warning' onClick={handleShow}>
            Guide
          </Button>
        </Col>
      </Row>

      <Offcanvas placement='end' show={guide} onHide={handleClose} backdrop={false} scroll={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Step-by-step Guide - List of Assays</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <p>This page allows you to edit an assay.</p>

          <h5>Step: 1 - Change Fields</h5>
          <ol>
            <li>You can change the assay name, code, and type. Assay name and code must be unique for all assays.</li>    
          </ol> 

          <h5>Step: 2 - Modify Selection of Reagents for Individual Assays</h5>
          <ol>
            <li>Select a reagent to add from the reagent list on the right.</li> 
            <li>Select a reagent to remove from the added reagents list on the left.</li>   
          </ol> 

          <h5>Step: 3 - Modify Selection of Assays for Group Assays</h5>
          <ol>
            <li>Select individual assays to add from the assay list on the right.</li> 
            <li>Select an individual assay to remove from the added assays list on the left.</li>    
          </ol> 

          <h5>Step: 4 - Update Assay</h5>
          <ol>
            <li>Click the blue Update Assay button to update assay.</li>   
          </ol> 

          <h5>Step: 5 - Delete Assay</h5>
          <ol>
            <li>Click the red delete button to delete assay. Test_user has no permission to delete.</li>   
          </ol> 
        
        </Offcanvas.Body>
      </Offcanvas>

      <Card>
        <Card.Header style={{backgroundColor: '#0D6EFD', textAlign: 'center', color: '#FFFFFF'}}>Editing Assay...</Card.Header>
          <Card.Body>

            <Row>
              <Col>

                {/* UI for individual assays */}
                {location.state.assay.assay.length === 0 && 
                <Container>
                  <Form onSubmit={updateAssay}>
                    <Form.Group>
                      <Form.Label>Assay Name</Form.Label>
                      <Form.Control isInvalid={nameValidated} required name="name" type="text" placeholder="Enter name of assay" defaultValue={location.state.assay.name}/>
                      <Form.Control.Feedback type="invalid">{nameValidated && !uniqueErrorName ? "Assay must have a name." : "Assay with this name already exists."}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Assay Code</Form.Label>
                      <Form.Control isInvalid={codeValidated} required name="code" type="text" placeholder="Enter code of assay" defaultValue={location.state.assay.code}/>
                      <Form.Control.Feedback type="invalid">{codeValidated && !uniqueErrorCode ? "Assay must have a code." : "Assay with this code already exists."}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Assay Type</Form.Label>
                      <Form.Select name="type">
                        <option>{location.state.assay.type}</option>
                        {location.state.assay.type==="DNA" && <option>RNA</option>}
                        {location.state.assay.type==="DNA" && <option>Total nucleic</option>}

                        {location.state.assay.type==="RNA" && <option>DNA</option>}
                        {location.state.assay.type==="RNA" && <option>Total nucleic</option>}

                        {location.state.assay.type==="Total nucleic" && <option>DNA</option>}
                        {location.state.assay.type==="Total nucleic" && <option>RNA</option>}
                      </Form.Select>
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
                    {addedReagents.length > 0 && <Button type="submit">Update Assay</Button>}
                  </Form>
                  <Button variant="danger" onClick={() => deleteAssay()}>Delete</Button>
                </Container>}

                {/* UI for group assays */}
                {location.state.assay.assay.length > 1 &&
                <Container> 
                  <Form onSubmit={updateAssay}>
                    <Form.Group>
                      <Form.Label>Assay Name</Form.Label>
                      <Form.Control isInvalid={nameValidated} required name="name" type="text" placeholder="Enter name of assay" defaultValue={location.state.assay.name}/>
                      <Form.Control.Feedback type="invalid">{nameValidated && !uniqueErrorName ? "Assay must have a name." : "Assay with this name already exists."}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Assay Code</Form.Label>
                      <Form.Control isInvalid={codeValidated} required name="code" type="text" placeholder="Enter code of assay" defaultValue={location.state.assay.code}/>
                      <Form.Control.Feedback type="invalid">{codeValidated && !uniqueErrorCode ? "Assay must have a code." : "Assay with this code already exists."}</Form.Control.Feedback>
                    </Form.Group>

                    <Card bg='primary' text='light' style={{marginTop: '10px'}}>
                      <Card.Header>Added Assays</Card.Header>
                      <ListGroup>
                        {addedAssays.map(assay => (
                          <ListGroup.Item action key={assay.pk} onClick={() => removeAssayFromGroup(assay)}>
                            {`${assay.code}-${assay.name}`}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                    {addedAssays.length > 0 && <Button type="submit">Update Assay</Button>}
                  </Form>
                  <Button variant="danger" onClick={() => deleteAssay()}>Delete</Button>
                </Container>}
              </Col>
              

              <Col>
                {location.state.assay.assay.length === 0 && 
                <Container>
                  <Card bg='primary' text='light'>
                    <Card.Header>List of Reagents</Card.Header>
                    <Form onChange={() => searchBar()}>
                      <Form.Control
                        type='search'
                        placeholder="Search for Reagents to Add to Assay"
                        id="search"/>
                    </Form>

                    <ListGroup>
                      {reagents
                        .filter(reagent => !addedReagents.includes(reagent))
                        .filter(reagent => !addedReagents.map(r => r.pk).includes(reagent.pk))
                        .filter(reagent => search !== null ? reagent.name.toLowerCase().includes(search) || reagent.catalogNumber.includes(search) : reagent)
                        .map(reagent => (
                          <ListGroup.Item variant="secondary" key={reagent.pk} action onClick={() => addReagentToGroup(reagent)}>
                            {`${reagent.catalogNumber}-${reagent.name}`}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </Card>
                </Container>}

                {location.state.assay.assay.length > 1 && 
                <Container>
                  <Card bg='primary' text='light'>
                    <Card.Header>List of Assays</Card.Header>
                    <Form className="d-flex" onChange={() => searchBar()}>
                      <Form.Control
                        type="search"
                        placeholder="Search for Individual Assays"
                        id="search"
                      />
                    </Form>

                    <ListGroup>
                      {assays
                        //allow assays clicked to be edited/details and added to group assay
                        .filter(assay => assay.assay.length === 0)
                        .filter(assay => !addedAssays.map(a => a.pk).includes(assay.pk))
                        .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
                        .map(assay => (
                          <ListGroup.Item key={assay.pk} action onClick={() => addAssayToGroup(assay)}>
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

export default EditAssay;