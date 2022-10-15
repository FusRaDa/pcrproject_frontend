import React, { useContext, useState, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const AddBatchLabels = () => {
  let {authTokens} = useContext(AuthContext)
  let [fields, setFields] = useState([])
  let [change, setChange] = useState(false)
  
  useEffect(() => {
    getLabels()
    // eslint-disable-next-line
  }, [change])

  let getLabels = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/labels/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()
    if(response.status === 200) {
      setFields(data)
      console.log(data)
      setChange(false)

    } else {
      alert('error')
    }
  }

  let addLabel = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/labels/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'label': e.target.label.value})
    })
    if(response.status === 201) {
      console.log('label added successfully')
      setChange(true)
      document.getElementById("add_label").value = ""
    } else {
      alert('Column Name Already Exists')
    }
  }

  let deleteLabel = async (pk) => {
    let response = await fetch(`http://127.0.0.1:8000/api/labels/${pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 204) {
      console.log('label deleted')
      setChange(true)
    } else {
      alert('error')
    }
  }

  let updateLabel = async (pk) => {
    let update = document.getElementById(pk).value
    let response = await fetch(`http://127.0.0.1:8000/api/labels/${pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'label': update})
    })
    if(response.status === 200) {
      console.log('label updated')
      setChange(true)
    } else {
      alert('error')
    }
  }

  let updateButton = (pk) => {
    let isReadOnly = document.getElementById(pk).readOnly
    if (isReadOnly) {
      document.getElementById(pk).readOnly = false
      document.getElementById(`button_${pk}`).defaultValue = 'Update'
    } else {
      document.getElementById(pk).readOnly = true
      document.getElementById(`button_${pk}`).defaultValue = 'Edit'
      // updateLabel(pk)
    }
  }

  return (
    <div>
      <ul>
        {fields.map(field => (
          <Row key={field.pk}>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Control type="text" id={field.pk} defaultValue={field.label} readOnly/>
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <form>
                <input id={`button_${field.pk}`} type="button" defaultValue="Edit" onClick={() => {updateButton(field.pk)}} />
                <input type="button" defaultValue="Delete" onClick={() => deleteLabel(field.pk)} />
              </form>
            </Col>
          </Row>
        ))}
      </ul>
      <Row>
        <form onSubmit={addLabel}>
          <input type="text" id="add_label" name="label" placeholder="Enter New Column"/>
          <input type="submit"/>
        </form>
      </Row>

      
    </div>
  )
}

export default AddBatchLabels