import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';

const EditBatch = () => {
  
  const navigate = useNavigate()
  const params = useParams()
  let [batch, setBatch] = useState([])
  let {authTokens} = useContext(AuthContext)
  let [recieved, setRecieved] = useState(false)
  let [assays, setAssays] = useState([])
  let [labels, setLabels] = useState([])

  let getBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${params.pk}/retrieve/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json() 
    if(response.status === 200) {
      console.log('batch retrieved')
      console.log(data)
      setBatch(data)
      setRecieved(true)
    } else {
      alert('error')
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
    } else {
      alert('error')
    }
  }

  let updateBatch = async (e) => {
    e.preventDefault()
    let selection = selectAssay(e)
    let labelData = batchData(e)
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${params.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'assay':selection, 'numberOfSamples':e.target.numberOfSamples.value, fieldLabels: labelData})
    })
    let data = await response.json() 
    if(response.status === 200) {
      setBatch(data)
      console.log('batch updated')
      navigate('/')
    } else {
      alert('error')
    }
  }

  // gather data fro fieldLabels
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

  //gather data from selected assay
  let selectAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.assay.value) {
        return assays[i]
      }
    }
  } 

  let deleteBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${params.pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 204) {
      console.log('batch deleted')
      navigate('/')
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    getLabels()
    getAssays()
    getBatch(params.pk)
    // eslint-disable-next-line
  }, [])
 
  if (recieved) {
    return (
      <div>
        Update Batch
        <form onSubmit={updateBatch}>
          <div>
              <Form.Select name="assay" aria-label="Default select example">
                <option value={batch.assay.pk}>{`${batch.assay.code}-${batch.assay.name}`}</option>
                {assays
                  .filter(assay => assay.name !== batch.assay.name)
                  .map(assay => (
                  <option key={assay.pk} value={assay.pk}>{`${assay.code}-${assay.name}`}</option>
                ))}
              </Form.Select>
          </div>
          <div>
            Number of Samples
            <input type="text" name="numberOfSamples" defaultValue={batch.numberOfSamples}/>
          </div>
          {labels.map((label, index) => (
          <div key={`info_${label.pk}`}>
            {label.label}
            <input
              type="text"
              name="info"
              placeholder={`Enter ${label.label} Information`}
              defaultValue={batch.fieldLabels === null ? "" : Object.values(batch.fieldLabels)[index]}
            />
          </div>
          ))}
          <input type="submit"/>
        </form>
        <div>
          <button onClick={deleteBatch}>Delete</button>
        </div>
      </div>
    )
  }
}

export default EditBatch