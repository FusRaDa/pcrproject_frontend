import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';
import BatchesContext from "../context/BatchContext";
import Container from "react-bootstrap/esm/Container";

const EditBatch = ({pk, setEditing}) => {
  //global
  let {labels} = useContext(BatchesContext)
  let {authTokens} = useContext(AuthContext)

  //local
  let [assays, setAssays] = useState([])
  let [batch, setBatch] = useState([])
  let [rna, setRNA] = useState(true)
  let [dna, setDNA] = useState(true)
 
  let getBatch = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/retrieve/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json() 
    if(response.status === 200) {
      console.log('batch retrieved')
      console.log(data)
      setBatch(data)
    } else {
      alert('error')
    }
  }

  let getAssays = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/assays/', {
      method: 'GET', 
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    if (response.status === 200) {
      console.log('assays recieved')
      console.log(data)
      setAssays(data)
    } else {
      alert('error')
    }
  }

  let updateBatch = async (e) => {
    e.preventDefault()
    let selection = selectAssay(e)
    let labelData = batchData(e)
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        'assay':selection, 
        'numberOfSamples':e.target.numberOfSamples.value,
        'dna_extraction': e.target.dna.value === "" ? null : e.target.dna.value,
        'rna_extraction': e.target.rna.value === "" ? null : e.target.rna.value,
        'fieldLabels': labelData
      })
    })
    let data = await response.json() 
    if(response.status === 200) {
      setBatch(data)
      console.log('batch updated')
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

  //gather data from selected assay
  let selectAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.assay.value) {
        return assays[i]
      }
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
    if(response.status === 204) {
      console.log('batch deleted')
      setEditing(false)
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    getBatch()
    getAssays()
    // eslint-disable-next-line
  }, [])

  let chooseAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.value) {
        disableExtractionGroup(assays[i])
      }
    }
  }

  let disableExtractionGroup = (chosenAssay) => {
    //reset
    setDNA(true)
    setRNA(true)

    //for single assay
    if (chosenAssay.group.length === 0) {
      if (chosenAssay.type === 'DNA') {
        setDNA(false)
        document.getElementById('rna_value').value=""
      }
      if (chosenAssay.type === 'RNA' || chosenAssay.type === 'Total nucleic') {
        setRNA(false)
        document.getElementById('dna_value').value=""
      }
    //for assays in a group
    } else if (chosenAssay.group.length >= 0) {
      let dna = false
      let rna = false
      for (let i=0; i<chosenAssay.group.length; i++) {
        if (chosenAssay.group[i].type === 'DNA') {
          dna = true
        }
        if (chosenAssay.group[i].type === 'RNA' || chosenAssay.group[i].type === 'Total nucleic') {
          rna = true
        }
      }
      if (dna) {
        setDNA(false)
        if (!rna) {
          document.getElementById('rna_value').value=""
        }
      }
      if (rna) {
        setRNA(false)
        if (!dna) {
          document.getElementById('dna_value').value=""
        }
      }
    }
  }

  return (
    <Container>
      <Col>
        <Form onSubmit={updateBatch}>
          <Form.Group>
            <Form.Label>Assay Selected</Form.Label>
              <Form.Select name="assay" aria-label="Default select example" onChange={chooseAssay} >
                <option>{`${batch.assay.code}-${batch.assay.name}`}</option>
                {assays
                  .filter(assay => assay.name !== batch.assay.name )
                  .map(assay => (
                  <option key={assay.pk} value={assay.pk}>{`${assay.code}-${assay.name}`}</option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Number Of Samples</Form.Label>
            <Form.Control name="samples" type="text" placeholder="Enter Number of Samples"/>
          </Form.Group>
          <Form.Group>
            <Form.Label>DNA Extraction Group</Form.Label>
            <Form.Control 
              id="dna_value" name="dna" type="text" 
              required={dna===false ? true : false} 
              placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} 
              disabled={dna}>
                {batch.dna_extraction}
              </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>RNA/Total-Nucleic Group</Form.Label>
            <Form.Control 
              id="rna_value" name="rna" type="text" 
              required={dna===false ? true : false} 
              placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} 
              disabled={rna}>
                {batch.rna_extraction}
              </Form.Control>
          </Form.Group>

          <Form.Label>Additional Information</Form.Label>
            {labels.map(label => (
              <Form.Group key={`info_${label.pk}`}>
                <Form.Control
                  type="text"
                  name="info"
                  placeholder={`Enter ${label.label} Information`}
                />
              </Form.Group>
            ))}
          <Button type="submit" variant="primary">Update Batch</Button>
        </Form>
        <Button type="submit" variant="primary" onClick={deleteBatch}>Delete Batch</Button>
      </Col>
    </Container>
  )
}


export default EditBatch