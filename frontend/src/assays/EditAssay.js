import React, { useContext } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/esm/Row"
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import AssayContext from "../context/AssayContext"

const EditAssay = () => {

  const location = useLocation()

  const navigate = useNavigate()

  let {authTokens} = useContext(AuthContext)
  let {setUpdating} = useContext(AssayContext)

  let updateAssay = async (e) => {
    e.preventDefault()

    let response = await fetch(`http://127.0.0.1:8000/api/assays/${location.state.assay.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        'name': e.target.name.value,
        'code': e.target.code.value,
        'type': e.target.type.value,
        // 'reagent':
        // 'supply':
        // 'assays':
      })
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

  return (
    <Container>
      <Row>
        <Col>

          {location.state.assay.assays.length === 0 && 
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
          </Form>}


          {location.state.assay.assays.length > 1 && 
          <Form>
            Group assay
          </Form>}

          <Button onClick={() => deleteAssay()}>Delete</Button>
        </Col>
        

        <Col>
          
        </Col>

      </Row>
    </Container>
  )

}

export default EditAssay;