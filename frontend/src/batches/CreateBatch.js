import React, { useContext, useEffect, useState } from "react"

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

  //validation variables for UX
  let [assayValidated, setAssayValidated] = useState(false)
  let [samplesValidated, setSamplesValidated] = useState(false)
  let [sampleNumber, setSampleNumber] = useState(0)
  let [extGroupValidatedDNA, setExtGroupValidatedDNA] = useState(false)
  let [extGroupValidatedRNA, setExtGroupValidatedRNA] = useState(false)
  let [dnaValue, setDNAValue] = useState("")
  let [rnaValue, setRNAValue] = useState("")
  let [uniqueErrorDNA, setUniqueErrorDNA] = useState(false)
  let [uniqueErrorRNA, setUniqueErrorRNA] = useState(false)

  useEffect(() => {
    setExtGroupValidatedDNA(false)
    setExtGroupValidatedRNA(false)
  }, [selectedAssay])


  let resetAllValidations = () => {
    //set all validations back to false
    setAssayValidated(false)
    setSamplesValidated(false)
    setSampleNumber(0)
    setExtGroupValidatedDNA(false)
    setExtGroupValidatedRNA(false)
    setDNAValue("")
    setRNAValue("")
    setUniqueErrorDNA(false)
    setUniqueErrorRNA(false)
  }

  let validateExtractionGroup = (str) => {
    if (str.length !== 3) {
      return false
    }
    return /^[A-Z]*$/.test(str)
  }

  let validateNumberOfSamples = (num) => {
    if (num < 1) {
      return false
    }
    return /^[0-9]*$/.test(num)
  }

  let addBatch = async (e) => {
    e.preventDefault()
    let date = new Date()

    let validationFailed = false
    if (selectedAssay === null) {
      validationFailed = true
      setAssayValidated(true)
    }

    if (!validateNumberOfSamples(e.target.samples.value)) {
      validationFailed = true
      setSamplesValidated(true)
    }

    if ((!validateExtractionGroup(dnaValue) && !dna)) {
      validationFailed = true
      setExtGroupValidatedDNA(true)
    }

    if (!validateExtractionGroup(rnaValue) && !rna) {
      validationFailed = true
      setExtGroupValidatedRNA(true)
    }

    if (validationFailed) {
      return
    }

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
      resetAllValidations()
    }  
    
    if (response.status === 400) { 
      let errorMessage = await response.json()
      
      if (errorMessage.dna_extraction) {
        setExtGroupValidatedDNA(true)
        setUniqueErrorDNA(true)
      }

      if (errorMessage.rna_extraction) {
        setExtGroupValidatedRNA(true)
        setUniqueErrorRNA(true)
      }

      //refer to serializer.py in batch create method
      if (errorMessage[0] === "Batch cannot share the same extraction groups.") {
        console.log('same')
      }


    }
  }

  let clearFields = () => {
    setSelectedAssay(null)
    setDNA(true)
    setRNA(true)
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
                <Form.Control isInvalid={selectedAssay !== null ? false : assayValidated} id="assay" required placeholder="Select Assay" disabled defaultValue={selectedAssay === null ? "" : `${selectedAssay.code}-${selectedAssay.name}`}/>
                <Form.Control.Feedback type='invalid'>Select an assay from the list.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>Number Of Samples</Form.Label>
                <Form.Control isInvalid={validateNumberOfSamples(sampleNumber) ? false : samplesValidated} id="samples" required name="samples" type="text" placeholder="Enter Number of Samples" onChange={(e) => setSampleNumber(e.target.value)}/>
                <Form.Control.Feedback type='invalid'>Enter number of samples processed in batch.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>DNA Extraction Group</Form.Label>
                <Form.Control 
                  id="dna_value" name="dna" type="text" 
                  required={dna===false ? true : false} 
                  placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} 
                  disabled={dna}
                  isInvalid={(validateExtractionGroup(dnaValue) && !uniqueErrorDNA) || dna ? false : extGroupValidatedDNA}
                  onChange={(e) => setDNAValue(e.target.value)}/>
                <Form.Control.Feedback type='invalid'>{uniqueErrorDNA ? "Batch with this extraction group already exists" : "Enter a unique three capitalized letter code."}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group style={{marginTop: '15px'}}>
                <Form.Label>RNA/Total-Nucleic Group</Form.Label>
                <Form.Control 
                  id="rna_value" name="rna" type="text" 
                  required={rna===false ? true : false} 
                  placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} 
                  disabled={rna}
                  isInvalid={(validateExtractionGroup(rnaValue) && !uniqueErrorRNA) || rna ? false : extGroupValidatedRNA}
                  onChange={(e) => setRNAValue(e.target.value)}/>
                 <Form.Control.Feedback type='invalid'>{uniqueErrorRNA ? "Batch with this extraction group already exists" : "Enter a unique three capitalized letter code."}</Form.Control.Feedback>
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