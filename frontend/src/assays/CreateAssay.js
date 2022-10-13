import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const CreateAssay = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)

  let addAssay = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/assays/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'name':e.target.name.value, 'code':e.target.code.value})
    })
    if(response.status === 201) {
      console.log('assay created successfully')
      navigate('/assay')
    } else {
      console.log(response)
      alert('error')
    }
  }

  return (
    <div>
      <form onSubmit={addAssay}>
        <input type="text" name="name" placeholder="Enter Assay Name"/>
        <input type="text" name="code" placeholder="Enter Assay Code"/>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default CreateAssay