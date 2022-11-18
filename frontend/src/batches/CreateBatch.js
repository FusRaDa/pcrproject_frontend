import React, { useContext, useState } from "react"

import AuthContext from "../context/AuthContext"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import BatchContext from "../context/BatchContext"
import Row from 'react-bootstrap/Row'
import AssayContext from "../context/AssayContext"

const CreateBatch = () => {
  let {authTokens} = useContext(AuthContext)
  let {labels, setUpdating} = useContext(BatchContext)
  let {assays} = useContext(AssayContext)

  let [rna, setRNA] = useState(true)
  let [dna, setDNA] = useState(true)

  let [groupList, setGroupList] = useState(false)
  let [selectedAssay, setSelectedAssay] = useState(null)

  let [search, setSearch] = useState("")

  let [validated, setValidated] = useState(false)

  let [errorMessages, setErrorMessages] = useState(null)



  let validateExtractionGroup = (str) => {
    if (str.length !== 3) {
      return false
    }
    return /^[A-Z]*$/.test(str)
  }

  let addBatch = async (e) => {
    e.preventDefault()

    let dnaValue = e.target.dna.value.toUpperCase()
    let rnaValue = e.target.rna.value.toUpperCase()

    if (!validateExtractionGroup(dnaValue) || !validateExtractionGroup(rnaValue)) {
      setValidated(true)
    }

    let date = new Date()
    let labelData = batchData(e)
 
    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        'assay': selectedAssay, 
        'numberOfSamples': e.target.samples.value, 
        'batchDate': date, 
        'dna_extraction': dna === true ? null : dnaValue,
        'rna_extraction': rna === true ? null : rnaValue, 
        'fieldLabels': labelData
      })
    })
  
    if(response.status === 201) {
      console.log('batch created successfully')
      setUpdating(true)
      clearFields()
    } else {
      //TODO: validate in backend for extraction group must be capital letters with length of 
      setErrorMessages(await response.json())
      setValidated(true)
      // alert('error')
    }
  }

 

  let clearFields = () => {
    setSelectedAssay(null)
    document.getElementById('samples').value = ""
    document.getElementById('dna_value').value = ""
    document.getElementById('rna_value').value = ""
    labels.forEach(label => {
      document.getElementById(`label_${label.pk}`).value= ""
    })
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

  let chooseAssay = (pk) => {
    for (let i=0; i<assays.length; i++) {
      //ignore eslint warning
      // eslint-disable-next-line
      if (assays[i].pk == pk) {
        setSelectedAssay(assays[i])
        disableExtractionGroup(assays[i])
      }
    }
  }

  let disableExtractionGroup = (chosenAssay) => {
    //reset
    setDNA(true)
    setRNA(true)

    //for single assay
    if (chosenAssay.assay.length === 0) {
      if (chosenAssay.type === 'DNA') {
        setDNA(false)
        document.getElementById('rna_value').value=""
      }
      if (chosenAssay.type === 'RNA' || chosenAssay.type === 'Total nucleic') {
        setRNA(false)
        document.getElementById('dna_value').value=""
      }
    //for assays in a group (assays)
    } else if (chosenAssay.assay.length >= 0) {
      let dna = false
      let rna = false
      for (let i=0; i<chosenAssay.assay.length; i++) {
        if (chosenAssay.assay[i].type === 'DNA') {
          dna = true
        }
        if (chosenAssay.assay[i].type === 'RNA' || chosenAssay.assay[i].type === 'Total nucleic') {
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

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Container>
            <Form onSubmit={addBatch} style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}} noValidate>
              <Form.Group>
                <Form.Label>Assay</Form.Label>
                <Form.Control isInvalid={selectedAssay === null ? validated : false} id="assay" required placeholder="Select Assay" disabled defaultValue={selectedAssay === null ? "" : `${selectedAssay.code}-${selectedAssay.name}`}/>
                <Form.Control.Feedback type='invalid'>Select an assay from the list.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>Number Of Samples</Form.Label>
                <Form.Control isInvalid={validated} id="samples" required name="samples" type="text" placeholder="Enter Number of Samples"/>
                <Form.Control.Feedback type='invalid'>Enter number of samples proccessed in batch.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>DNA Extraction Group</Form.Label>
                <Form.Control 
                  id="dna_value" name="dna" type="text" 
                  required={dna===false ? true : false} 
                  placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} 
                  disabled={dna}
                  isInvalid={dna ? false : true}/>
                <Form.Control.Feedback type='invalid'>Enter a unique three letter code.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>RNA/Total-Nucleic Group</Form.Label>
                <Form.Control 
                  id="rna_value" name="rna" type="text" 
                  required={rna===false ? true : false} 
                  placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} 
                  disabled={rna}
                  isInvalid={rna ? false : true}/>
                 <Form.Control.Feedback type='invalid'>Enter a unique three letter code.</Form.Control.Feedback>
              </Form.Group>
            
              <Form.Label style={{marginTop: '15px'}}>Additional Information</Form.Label>
              {labels.map(label => (
                <Form.Group key={label.pk}>
                  <Form.Control
                    id={`label_${label.pk}`}
                    type="text"
                    name="info"
                    placeholder={`Enter ${label.label} Information (Optional)`}
                  />
                </Form.Group>
                ))}
              <Button type="submit" variant="primary">Create Batch</Button>
            </Form>
            </Container>
          </Col>

          <Col>
          <Container>
          <Button onClick={() => setGroupList(!groupList)}>{groupList ? "View Individual Assays" : "View Group Assays"}</Button>
            <Form className="d-flex" onChange={() => searchAssay()}>
              <Form.Control
                type="search"
                placeholder={!groupList ? "Search for Individual Assays" : "Search for Group Assays"}
                id="search"
              />
            </Form>

            {!groupList && <ListGroup style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
            {assays
              .filter(assay => assay.assay.length === 0)
              .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
              .map(assay => (
                <ListGroup.Item action variant="secondary" key={assay.pk} onClick={() => chooseAssay(assay.pk)}>
                  {assay.name}
                </ListGroup.Item>
            ))}
            </ListGroup>}

            {groupList && <ListGroup style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
            {assays
              .filter(assay => assay.assay.length > 1)
              .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
              .map(assay => (
                <ListGroup.Item action variant="secondary" key={assay.pk} onClick={() => chooseAssay(assay.pk)}>
                  {assay.name}
                </ListGroup.Item>
            ))}
            </ListGroup>}
          </Container>
        </Col>
        
      </Row>
    </Container>
  )
}

export default CreateBatch