import React, { useContext, useState, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import Row from 'react-bootstrap/Row'

const BatchLabels = () => {
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
    let edit = notUpdating()
    if (edit === true) {
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
    } else {
      alert('update fields first')
    }
  
  }

  let deleteLabel = async (pk) => {
    let edit = notUpdating()
    if (edit === true) {
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
    } else {
      alert('update fields first')
    }
  }

  let updateLabel = async (pk) => {
    let update = document.getElementById(pk).value
    let current = document.getElementById(pk).defaultValue
    if (update !== current) {
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
      } else {
        alert('error')
      }
    } else {
      alert('same field name')
    }
  }

  let updateLabelEnter = async (e) => {
    e.preventDefault()
    let update = e.target.field.value
    if (update !== e.target.field.defaultValue) {
      let response = await fetch(`http://127.0.0.1:8000/api/labels/${e.target.field.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({'label': update})
      })
      if(response.status === 200) {
        console.log('label updated')
        document.getElementById(e.target.field.id).readOnly = true
        document.getElementById(`button_${e.target.field.id}`).defaultValue = 'Edit'
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

  let notUpdating = () => {
    let list = []
    fields.map(field => (
      list.push(document.getElementById(field.pk).readOnly)
    ))
    if (list.every(element => element === true)) {
      return true
    } else {
      return false
    }
  }

  return (
    <div>
      {fields.map(field => (
        <Row key={field.pk}>
          <form onSubmit={updateLabelEnter}>
              <input name="field" type="text" id={field.pk} defaultValue={field.label} readOnly/>
              <input type="button" id={`button_${field.pk}`} defaultValue="Edit" onClick={() => editFields(field.pk)} />              
              <input type="button" defaultValue="Delete" onClick={() => deleteLabel(field.pk)} />
          </form>
        </Row>
      ))}
      <Row>
        <form onSubmit={addLabel}>
          <input type="text" id="add_label" name="label" placeholder="Enter New Column"/>
          <input type="submit"/>
        </form>
      </Row>

      
    </div>
  )
}

export default BatchLabels