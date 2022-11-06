import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';
import BatchContext from "../context/BatchContext";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button'

const EditBatch = ({selectedBatch, setEditing}) => {

  //global
  let {labels, setUpdating} = useContext(BatchContext)
  let {authTokens} = useContext(AuthContext)

  let updateBatch = async (e) => {
    e.preventDefault()
    let labelData = batchData(e)
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${selectedBatch.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        'assay':selectedBatch.assay, 
        'numberOfSamples':e.target.samples.value,
        'dna_extraction': selectedBatch.dna_extraction !== null ? e.target.dna.value : null,
        'rna_extraction': selectedBatch.rna_extraction !== null ? e.target.rna.value : null,
        'fieldLabels': labelData
      })
    })
    if(response.status === 200) {
      console.log('batch updated')
      setUpdating(true) //update table
      setEditing(false)
    } else {
      alert('error')
    }
  } 

  // gather data from fieldLabels
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

  let deleteBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${selectedBatch.pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 204) {
      console.log('batch deleted')
      setUpdating(true)
      setEditing(false)
    } else {
      alert('error')
    }
  }

  return (
    <Container fluid="md">
      <Form onSubmit={updateBatch}>
        <Form.Group>
          <Form.Label>Assay Selected</Form.Label>
            <Form.Control value={`${selectedBatch.assay.code}-${selectedBatch.assay.name}`} disabled/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Number Of Samples</Form.Label>
          <Form.Control name="samples" type="text" placeholder="Enter Number of Samples" key={selectedBatch.numberOfSamples} defaultValue={selectedBatch.numberOfSamples}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>DNA Extraction Group</Form.Label>
          <Form.Control
            id="dna_input" name="dna" type="text" 
            required={selectedBatch.dna_extraction !== null ? true : false} 
            disabled={selectedBatch.dna_extraction !== null ? false : true}
            placeholder="Not Required"
            key={selectedBatch.dna_extraction !== null ? selectedBatch.dna_extraction : null}
            defaultValue={selectedBatch.dna_extraction !== null ? selectedBatch.dna_extraction : null}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>RNA/Total-Nucleic Group</Form.Label>
          <Form.Control
            id="rna_input" name="rna" type="text" 
            required={selectedBatch.rna_extraction !== null ? true : false} 
            disabled={selectedBatch.rna_extraction !== null ? false : true}
            placeholder="Not Required"
            key={selectedBatch.rna_extraction !== null ? selectedBatch.rna_extraction : null}
            defaultValue={selectedBatch.rna_extraction !== null ? selectedBatch.rna_extraction : null}/>
        </Form.Group>

        <Form.Label>Additional Information</Form.Label>
          {labels.map(label => (
            <Form.Group key={`info_${label.pk}`}>
              <Form.Control
                type="text"
                name="info"
                placeholder={`Enter ${label.label} Information`}
                key={selectedBatch.fieldLabels[label.label]}
                defaultValue={selectedBatch.fieldLabels[label.label]}
              />
            </Form.Group>
          ))}
        <Button type="submit" variant="primary">Update Batch</Button>
      </Form>
      <Button type="submit" variant="primary" onClick={deleteBatch}>Delete Batch</Button>
    </Container>
  )
}


export default EditBatch