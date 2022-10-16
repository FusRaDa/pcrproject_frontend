import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const CreateBatch = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
  let [labels, setLabels] = useState([])

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
      setLabels(data)
      console.log(data)
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    getLabels()
    // eslint-disable-next-line 
  }, [])

  let addBatch = async (e) => {
    e.preventDefault()
    let data = batchData(e)
    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({"fieldLabels": data})
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      navigate('/')
    } else {
      alert('error')
    }
  }

  let batchData = (e) => {
    e.preventDefault()
    let keys = []
    labels.map(label => (
      keys.push(label.label)
    ))
    let values = Array.from(e.target.info)
    let data = {}
    for (var i = 0; i < values.length; i++) {
      data[keys[i]] = values[i].value   
    }
    return data
  }

  return (
    <div>
      <Row>
        <Col>
          {labels.map(label => (
            <div key={label.pk}>
              <input defaultValue={label.label} readOnly/>
            </div>
          ))}
        </Col>
        <Col>
        <form onSubmit={addBatch}>
          {labels.map(label => (
            <div key={`info_${label.pk}`}>
              <input
                type="text"
                name="info"
                placeholder={`Enter ${label.label} Information`}
              />
            </div>
            ))}
          <input type="submit"/>
        </form>
        </Col>
      </Row>
    </div>
  )
}

export default CreateBatch