import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
import AuthContext from './AuthContext'

const BatchContext = createContext()

export default BatchContext

export const BatchProvider = ({children}) => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
  let [batch, setBatch] = useState([])

  let addBatch = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'assay':e.target.assay.value, 'numberOfSamples':e.target.numberOfSamples.value})
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      navigate('/')
    } else {
      alert('error')
    }
  }

  let getBatch = async (pk) => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/retrieve/`, {
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
    } else {
      alert('error')
    }
  }

  let updateBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/update/`, {
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
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 200) {
      console.log('batch deleted')
      navigate('/')
    } else {
      alert('error')
    }
  }
  

  let contextData = {
    batch: batch,
    addBatch: addBatch,
    getBatch: getBatch,
    updateBatch: updateBatch,
    deleteBatch: deleteBatch
  }

  return (
    <BatchContext.Provider value={contextData} >
      {children}
    </BatchContext.Provider>
  )




}




