import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import BatchContext from '../context/BatchContext'

const EditableCell = ({ cell, value: initialValue }) => {
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

    let response = await fetch(`http://127.0.0.1:8000/api/batches/${batch.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
    })
    if(response.status === 200) {
      console.log('batch updated')
      setUpdating(true)
    } else {
      alert('error')
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

  return <input defaultValue={value} onChange={onChange} onKeyDown={handleKeyDown}/>
}

export default EditableCell