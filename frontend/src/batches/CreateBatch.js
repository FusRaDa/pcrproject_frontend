import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const CreateBatch = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
  const [inputFields, setInputFields] = useState([
    {column: "", info: ""}
  ])

  let addBatch = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'fieldLabels': {inputFields}})
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      navigate('/')
    } else {
      alert('error')
    }
  }

  const handleFormChange = (index, event) => {
    let data = [...inputFields]
    data[index][event.target.name] = event.target.value
    setInputFields(data)
    console.log(inputFields)
  }

  const addFields = () => {
    let newfield = { column: '', info: '' }
    setInputFields([...inputFields, newfield])
    console.log(inputFields)
  }

  return (
    <div>
      <form onSubmit={addBatch}>
        {inputFields.map((input, index) => {
          return (
            <div key={index}>
              <input
                name='column'
                placeholder='Enter Column Name'
                value={input.column}
                onChange={event => handleFormChange(index, event)}
              />
              <input
                name='info'
                placeholder='Enter Batch Information'
                value={input.info}
                onChange={event => handleFormChange(index, event)}
              />
            </div>
          )
        })}
        <button onClick={addBatch}>Submit</button>
      </form>
      <button onClick={addFields}>Add More..</button>
    </div>
  )
}

export default CreateBatch