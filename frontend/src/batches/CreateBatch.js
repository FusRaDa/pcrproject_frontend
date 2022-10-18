import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';

const CreateBatch = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
  let [labels, setLabels] = useState([])
  let [assays, setAssays] = useState([])

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
    getAssays()
    // eslint-disable-next-line 
  }, [])

  let addBatch = async (e) => {
    e.preventDefault()

    let date = new Date()
    let data = batchData(e)
    let selection = selectAssay(e)
    console.log(selection)

    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({"assay": selection, "numberOfSamples": e.target.samples.value, "batchDate": date, "fieldLabels": data})
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      navigate('/')
    } else {
      alert('error')
    }
  }

  let selectAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.assay.value) {
        return assays[i]
      }
    }
  } 

  let getAssays = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/assays/', {
      method: 'GET', 
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    if (response.status === 200) {
      setAssays(data)
      console.log(data)
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
        <form onSubmit={addBatch}>
          <div>
            <Form.Select name="assay" aria-label="Default select example">
              <option>Choose Assay</option>
              {assays.map(assay => (
                <option key={assay.pk} value={assay.pk}>{`${assay.code}-${assay.name}`}</option>
              ))}
            </Form.Select>
          </div>
          <div>
            <input name="samples" type="text" placeholder="Enter Number of Samples"/>
          </div>
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