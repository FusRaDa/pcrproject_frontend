import { useNavigate } from 'react-router-dom'
import { createContext } from 'react'

const BatchContext = createContext()

export default BatchContext

export const BatchProvider = ({children}) => {
  const navigate = useNavigate()

  let addBatch = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/modify/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let data = await response.json() 
    if(response.status === 200) {
      console.log('batch retrieved')
      console.log(data)
    } else {
      alert('error')
    }
  }

  let contextData = {
    addBatch: addBatch,
    getBatch: getBatch,
  }

  return (
    <BatchContext.Provider value={contextData} >
      {children}
    </BatchContext.Provider>
  )




}




