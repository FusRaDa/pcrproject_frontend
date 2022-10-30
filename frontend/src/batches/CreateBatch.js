import React, { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import BatchesContext from "../context/BatchContext"


const CreateBatch = () => {
  let {authTokens} = useContext(AuthContext)
  let {labels, setUpdating} = useContext(BatchesContext)

  let [assays, setAssays] = useState([])
  let [rna, setRNA] = useState(true)
  let [dna, setDNA] = useState(true)

  useEffect(() => {
    getAssays()
    // eslint-disable-next-line 
  }, [])

  let addBatch = async (e) => {
    e.preventDefault()

    let date = new Date()
    let labelData = batchData(e)
    let selection = selectAssay(e)
    console.log(selection)

    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        'assay': selection, 
        'numberOfSamples': e.target.samples.value, 
        'batchDate': date, 
        'dna_extraction': e.target.dna.value === "" ? null : e.target.dna.value,
        'rna_extraction': e.target.rna.value === "" ? null : e.target.rna.value, 
        'fieldLabels': labelData
      })
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      setUpdating(true)
      resetInputs()
    } else {
      alert('error')
    }
  }

  let resetInputs = () => {
    document.getElementById('assay').value="Choose Assay"
    document.getElementById('samples').value=""
    setDNA(true)
    setRNA(true)
    document.getElementById('rna_value').value=""
    document.getElementById('dna_value').value=""
    labels.map(label => (
      document.getElementById(`label_${label.pk}`).value=""
    ))
  }


  let selectAssay = (e) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == e.target.assay.value) {
        return assays[i]
      }
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
      setAssays(data)
      console.log(data)
    } else {
      alert('error')
    }
  }

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
    <Container fluid="md">
      <Col>
        <Form onSubmit={addBatch}>
          <Form.Group>
            <Form.Label>Assay Selected</Form.Label>
              <Form.Select id="assay" name="assay" aria-label="Default select example" onChange={chooseAssay} >
                <option>Choose Assay</option>
                {assays.map(assay => (
                  <option key={assay.pk} value={assay.pk}>{`${assay.code}-${assay.name}`}</option>
                ))}
              </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Number Of Samples</Form.Label>
            <Form.Control id="samples"  name="samples" type="text" placeholder="Enter Number of Samples"/>
          </Form.Group>
          <Form.Group>
            <Form.Label>DNA Extraction Group</Form.Label>
            <Form.Control 
              id="dna_value" name="dna" type="text" 
              required={dna===false ? true : false} 
              placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} 
              disabled={dna}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>RNA/Total-Nucleic Group</Form.Label>
            <Form.Control 
              id="rna_value" name="rna" type="text" 
              required={rna===false ? true : false} 
              placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} 
              disabled={rna}/>
          </Form.Group>
        
          <Form.Label>Additional Information</Form.Label>
          {labels.map(label => (
            <Form.Group key={label.pk}>
              <Form.Control
                id={`label_${label.pk}`}
                type="text"
                name="info"
                placeholder={`Enter ${label.label} Information`}
              />
            </Form.Group>
            ))}
          <Button type="submit" variant="primary">Create Batch</Button>
        </Form>
      </Col>
    </Container>
  )
}

export default CreateBatch