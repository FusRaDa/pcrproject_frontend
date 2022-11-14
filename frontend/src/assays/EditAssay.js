import React, { useContext, useState } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/esm/Row"
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import AssayContext from "../context/AssayContext"
import ListGroup from 'react-bootstrap/ListGroup'

const EditAssay = () => {

  const location = useLocation()

  const navigate = useNavigate()

  let {authTokens} = useContext(AuthContext)
  let {assays, setUpdating} = useContext(AssayContext)

  let [search, setSearch] = useState("")
  let [addedAssays, setAddedAssays] = useState(location.state.assay.assay)


  let updateAssay = async (e) => {
    e.preventDefault()
    let data = {}
    console.log(addedAssays)

    if (e.target.type !== undefined) {
      //individual assay
      data = {
        'name': e.target.name.value, 
        'code': e.target.code.value,
        'type': e.target.type.value,
        //TODO
        // 'reagent_ids': required,
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

    let response = await fetch(`http://127.0.0.1:8000/api/assays/${location.state.assay.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })
    if(response.status === 200) {
      console.log('batch updated')
      setUpdating(true)
      navigate('/assay')
    } else {
      alert('error')
    }
  } 

  let deleteAssay = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/assays/${location.state.assay.pk}/destroy/`, {
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

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  return (
    <Container>
      <Row>
        <Col>
          
          {location.state.assay.assay.length === 0 && 
          <Container>
            <Form onSubmit={updateAssay}>
              <Form.Group>
                <Form.Label>Assay Name</Form.Label>
                <Form.Control name="name" type="text" placeholder="Enter name of assay" defaultValue={location.state.assay.name}/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Assay Code</Form.Label>
                <Form.Control name="code" type="text" placeholder="Enter code of assay" defaultValue={location.state.assay.code}/>
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
                Refer to a list of reagents and supplies and add to assay
              </Form.Group>
              <Button type="submit">Update Assay</Button>
            </Form>
          </Container>}

          {location.state.assay.assay.length > 1 &&
          <Container> 
            <Form onSubmit={updateAssay}>
              <Form.Group>
                <Form.Label>Assay Name</Form.Label>
                <Form.Control name="name" type="text" placeholder="Enter name of assay" defaultValue={location.state.assay.name}/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Assay Code</Form.Label>
                <Form.Control name="code" type="text" placeholder="Enter code of assay" defaultValue={location.state.assay.code}/>
              </Form.Group>
 
              <ListGroup>
                {addedAssays.map(assay => (
                  <ListGroup.Item action key={assay.pk} onClick={() => removeAssayFromGroup(assay)}>
                    {`${assay.code}-${assay.name}`}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button type="submit">Update Assay</Button>
            </Form>
          </Container>}

          <Button onClick={() => deleteAssay()}>Delete</Button>
        </Col>
        

        <Col>

          {location.state.assay.assay.length === 0 && 
          <Container>
            List of Reagents and Supplies to add
          </Container>}

          {location.state.assay.assay.length > 1 && 
          <Container>
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
                .filter(assay => assay.assay.length === 0)
                .filter(assay => !addedAssays.map(a => a.pk).includes(assay.pk))
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

export default EditAssay;