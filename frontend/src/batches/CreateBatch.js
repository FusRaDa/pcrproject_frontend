import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const CreateBatch = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
 
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

  return (
    <div>
      <form onSubmit={addBatch}>
        <input type="text" name="assay" placeholder="Enter Assay Code"/>
        <input type="text" name="numberOfSamples" placeholder="Enter Number Of Samples"/>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default CreateBatch