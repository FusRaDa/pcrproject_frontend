import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const EditBatch = () => {
  
  const navigate = useNavigate()
  const params = useParams()
  let [batch, setBatch] = useState([])
  let {authTokens} = useContext(AuthContext)
  let [recieved, setRecieved] = useState(false)

  let getBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${params.pk}/retrieve/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let batch = await response.json() 
    if(response.status === 200) {
      console.log('batch retrieved')
      setBatch(batch)
      setRecieved(true)
    } else {
      alert('error')
    }
  }

  let updateBatch = async (e) => {
    e.preventDefault()
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${params.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'assay':e.target.assay.value, 'numberOfSamples':e.target.numberOfSamples.value})
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
    getBatch(params.pk)
    // eslint-disable-next-line
  }, [])
 
  if (recieved) {
    return (
      <div>
        <form onSubmit={updateBatch}>
          Update Batch
          <input type="text" name="assay" defaultValue={batch.assay.code}/>
          <input type="text" name="numberOfSamples" defaultValue={batch.numberOfSamples}/>
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