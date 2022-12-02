import React, { useContext } from "react"

//components
import AuthContext from "../context/AuthContext"
import BatchContext from "../context/BatchContext"
import ServerAddress from "../ServerAddress";

//style
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row'


const BatchLabels = () => {
  let {authTokens} = useContext(AuthContext)
  let {labels, setUpdating} = useContext(BatchContext)

  let addLabel = async (e) => {
    e.preventDefault()
    let edit = notUpdating()
    if (edit === true) {
      let response = await fetch(`${ServerAddress}/api/labels/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({'label': underscoreLabels(e.target.label.value)})
      })
      if(response.status === 201) {
        console.log('label added successfully')
        document.getElementById("add_label").value = ""
        setUpdating(true)
      } else {
        alert('Column Name Already Exists')
      }
    } else {
      alert('update fields first')
    }
  }

  let deleteLabel = async (pk) => {
    let edit = notUpdating()
    if (edit === true) {
      let response = await fetch(`${ServerAddress}/api/labels/${pk}/destroy/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        },
      })
      if(response.status === 204) {
        console.log('label deleted')
        setUpdating(true)
      } else {
        alert('error')
      }
    } else {
      alert('update fields first')
    }
  }

  //update label by pressing submit
  let updateLabel = async (pk) => {
    let update = document.getElementById(pk).value
    let current = document.getElementById(pk).defaultValue
    if (update !== current) {
      let response = await fetch(`${ServerAddress}/api/labels/${pk}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({'label': underscoreLabels(update)})
      })
      if(response.status === 200) {
        console.log('label updated')
        setUpdating(true)
      } else {
        alert('error')
      }
    } 
  }

  //update label by pressing enter
  let updateLabelEnter = async (e) => {
    e.preventDefault()
    let update = e.target.field.value
    if (update !== e.target.field.defaultValue) {
      let response = await fetch(`${ServerAddress}/api/labels/${e.target.field.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({'label': underscoreLabels(update)})
      })
      if(response.status === 200) {
        console.log('label updated')
        document.getElementById(e.target.field.id).readOnly = true
        document.getElementById(`button_${e.target.field.id}`).defaultValue = 'Edit'
        setUpdating(true)
      } else {
        alert('error')
      }
    }
  }

  let editFields = (pk) =>  {
    let isReadOnly = document.getElementById(pk).readOnly
    if (isReadOnly) {
      document.getElementById(pk).readOnly = false
      document.getElementById(`button_${pk}`).defaultValue = 'Update'
    } else {
      document.getElementById(pk).readOnly = true
      document.getElementById(`button_${pk}`).defaultValue = 'Edit'
      updateLabel(pk)
    }
  }

  //only allows a label to be updated one at a time
  let notUpdating = () => {
    let list = []
    labels.map(label => (
      list.push(document.getElementById(label.pk).readOnly)
    ))
    if (list.every(element => element === true)) {
      return true
    } else {
      return false
    }
  }

  //replace space with underscore to be compatible with table - ListBatch.js
  let underscoreLabels = (string) => {
    return string.replace(/ /g, '_')
  }

  //replace underscore with spaces for header column
  let spaceLabels = (string) => {
    return string.replace(/_+/g, ' ').trim()
  }

  return (
    <Container>
      {labels.map(label => (
        <Col key={label.pk}>
          <form onSubmit={updateLabelEnter}>
              <input name="field" type="text" id={label.pk} defaultValue={spaceLabels(label.label)} readOnly/>
              <input type="button" id={`button_${label.pk}`} defaultValue="Edit" onClick={() => editFields(label.pk)} />              
              <input type="button" defaultValue="Delete" onClick={() => deleteLabel(label.pk)} />
          </form>
        </Col>
      ))}
      
      <Row>
        <form onSubmit={addLabel}>
          <input type="text" required id="add_label" name="label" placeholder="Enter New Column"/>
          <input type="submit" value="Add"/>
        </form>
      </Row>
    </Container>
  )
}

export default BatchLabels