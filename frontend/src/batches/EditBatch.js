import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';
import BatchesContext from "../context/BatchContext";
import Container from "react-bootstrap/esm/Container";
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const EditBatch = ({pk, setEditing}) => {
  //global
  let {labels, setUpdating} = useContext(BatchesContext)
  let {authTokens} = useContext(AuthContext)

  //local
  let [assays, setAssays] = useState([])
  let [batch, setBatch] = useState([])
  let [rna, setRNA] = useState(true)
  let [dna, setDNA] = useState(true)
  let [recieved, setRecieved] = useState(false)


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
      setBatch(data)
      setRecieved(true)
      disableExtractionGroup(data.assay)
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
        'numberOfSamples':e.target.samples.value,
        'dna_extraction': e.target.dna.value === "" ? null : e.target.dna.value,
        'rna_extraction': e.target.rna.value === "" ? null : e.target.rna.value,
        'fieldLabels': labelData
      })
    })
    let data = await response.json() 
    if(response.status === 200) {
      console.log('batch updated')
      setBatch(data)
      setEditing(false)
      setUpdating(true)
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


  //control accessibility of extraction group fields
  let chooseAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.value) {
        disableExtractionGroup(assays[i])
      }
    }
  }

  //control accessibility of extraction group fields
  let disableExtractionGroup = (chosenAssay) => {
    //reset
    setDNA(true)
    setRNA(true)

    //for single assay
    if (chosenAssay.group.length === 0) {
      if (chosenAssay.type === 'DNA') {
        setDNA(false)
        if (document.getElementById('rna_input')) {
          document.getElementById('rna_input').value = ''
        }
      }
      if (chosenAssay.type === 'RNA' || chosenAssay.type === 'Total nucleic') {
        setRNA(false)
        if (document.getElementById('dna_input')) {
          document.getElementById('dna_input').value = ''
        }
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
          if (document.getElementById('rna_input')) {
            document.getElementById('rna_input').value = ''
          }
        }
      }
      if (rna) {
        setRNA(false)
        if (!dna) {
          if (document.getElementById('dna_input')) {
            document.getElementById('dna_input').value = ''
          }
        }
      }
    }
  }

 

  if (recieved) {
    return (
      <Container>
        <Col>
          <Form onSubmit={updateBatch}>
            <Form.Group>
              <Form.Label>Assay Selected</Form.Label>
                <Form.Select name="assay" aria-label="Default select example" onChange={chooseAssay}>
                  <option value={batch.assay.pk}>{`${batch.assay.code}-${batch.assay.name}`}</option>
                  {assays
                    .filter(assay => assay.name !== batch.assay.name )
                    .map(assay => (
                    <option key={assay.pk} value={assay.pk}>{`${assay.code}-${assay.name}`}</option>
                  ))}
              </Form.Select>
            </Form.Group>
  
            <Form.Group>
              <Form.Label>Number Of Samples</Form.Label>
              <Form.Control name="samples" type="text" placeholder="Enter Number of Samples" defaultValue={batch.numberOfSamples}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>DNA Extraction Group</Form.Label>
              <Form.Control
                id="dna_input" name="dna" type="text" 
                required={dna===false ? true : false} 
                placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} 
                disabled={dna}
                defaultValue={batch.dna_extraction !== null ? batch.dna_extraction : ""}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>RNA/Total-Nucleic Group</Form.Label>
              <Form.Control
                id="rna_input" name="rna" type="text" 
                required={rna===false ? true : false} 
                placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} 
                disabled={rna}
                defaultValue={batch.rna_extraction !== null ? batch.rna_extraction : ""}/>
            </Form.Group>
  
            <Form.Label>Additional Information</Form.Label>
              {labels.map(label => (
                <Form.Group key={`info_${label.pk}`}>
                  <Form.Control
                    type="text"
                    name="info"
                    placeholder={`Enter ${label.label} Information`}
                    defaultValue={batch.fieldLabels[label.label]}
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
}


export default EditBatch