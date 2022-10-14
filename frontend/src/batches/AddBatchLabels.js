import React, { useContext, useState, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const AddBatchLabels = () => {
  let {authTokens} = useContext(AuthContext)
  let [fields, setFields] = useState([])

  useEffect(() => {
    getLabels()
  }, [])

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
    } else {
      alert('error')
    }
  }

  // let addLabel = async (e) => {
  //   e.preventDefault()
  //   let response = await fetch('http://127.0.0.1:8000/api/labels/create', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization':'Bearer ' + String(authTokens.access)
  //     },
  //     body: JSON.stringify({'label': e.target.label.name})
  //   })
  //   if(response.status === 201) {
  //     console.log('label added successfully')
  //   } else {
  //     alert('error')
  //   }
  // }

  // const handleFormChange = (index, event) => {
  //   let data = [...inputFields]
  //   data[index][event.target.name] = event.target.value
  //   setInputFields(data)
  //   console.log(inputFields)
  // }

  // const addFields = () => {
  //   let newfield = { column: '', info: '' }
  //   setInputFields([...inputFields, newfield])
  //   console.log(inputFields)
  // }

  // return (
  //   <div>
  //     <form onSubmit={addBatch}>
  //       {inputFields.map((input, index) => {
  //         return (
  //           <div key={index}>
  //             <input
  //               name='column'
  //               placeholder='Enter Column Name'
  //               value={input.column}
  //               onChange={event => handleFormChange(index, event)}
  //             />
  //             <input
  //               name='info'
  //               placeholder='Enter Batch Information'
  //               value={input.info}
  //               onChange={event => handleFormChange(index, event)}
  //             />
  //           </div>
  //         )
  //       })}
  //       <button onClick={addBatch}>Submit</button>
  //     </form>
  //     <button onClick={addFields}>Add More..</button>
  //   </div>
  // )

  return (
    <div>
      <ul>
        {fields.map(field => (
          <Row key={field.pk}>
            <Col>Column:{field.label}</Col>
            <Col>Info:{field.pk}</Col>
          </Row>
        ))}
      </ul>
      {/* <button onClick={addFields}>Add Columns</button> */}
    </div>
  )
}

export default AddBatchLabels