import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import BatchContext from '../context/BatchContext'
import ServerAddress from '../ServerAddress'

const EditableCell = ({ cell, value: initialValue, setIsEdit}) => {
  let {authTokens} = useContext(AuthContext)
  let {setUpdating} = useContext(BatchContext)

  let [key, setKey] = useState(null)
  let [value, setValue] = useState(initialValue)
  let [batch, setBatch] = useState([])

  let updateBatch = async () => {
    if (value === initialValue) {
      return
    }

    let data = {}
    if (key.search("fieldLabels") > -1) {
      key = key.replace("fieldLabels.", "")
      let field = batch.fieldLabels
      field[key] = value
      data['fieldLabels'] = field
      data['assay'] = batch.assay
    } else {
      data[key] = value
      data['assay'] = batch.assay
    }

    let response = await fetch(`${ServerAddress}/api/batches/${batch.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })
    
    if (response.status === 200) {
      console.log('batch updated')
      setUpdating(true)
    } 

    if (response.status === 400) {
      let errorMessage = await response.json()
      console.log(errorMessage)

      if (errorMessage.dna_extraction !== undefined) {
        if (errorMessage.dna_extraction[0] === "Extraction group must be a three capitalized letter field.") {
          alert("Extraction group must be a three capitalized letter field.")
        } else {
          alert("Batch with this extraction group already exists.")
        }
      } 

      if (errorMessage.rna_extraction !== undefined) {
        if (errorMessage.rna_extraction[0] === "Extraction group must be a three capitalized letter field.") {
          alert("Extraction group must be a three capitalized letter field.")
        } else {
          alert("Batch with this extraction group already exists.")
        }
      }
      
    }
  } 
  
  const onChange = e => {
    setValue(e.target.value)
  }

  let handleKeyDown = e => {
    if (e.key === 'Enter') {
      updateBatch()
    }
  }

  useEffect(() => {
    setKey(cell.column.id)
    setValue(initialValue)
    setBatch(cell.row.original)
  }, [initialValue, cell])

  return <input style={{width: '100px'}} defaultValue={value} onChange={onChange} onKeyDown={handleKeyDown} onBlur={() => setIsEdit(false)}/>
}

export default EditableCell