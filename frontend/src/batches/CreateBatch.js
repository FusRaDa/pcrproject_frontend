import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


const CreateBatch = () => {
  const navigate = useNavigate()
  let {authTokens} = useContext(AuthContext)
  let [labels, setLabels] = useState([])
  let [assays, setAssays] = useState([])
  let [rna, setRNA] = useState(true)
  let [dna, setDNA] = useState(true)
 

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
      setLabels(data)
      console.log(data)
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    getLabels()
    getAssays()
    // eslint-disable-next-line 
  }, [])

  let addBatch = async (e) => {
    e.preventDefault()

    let date = new Date()
    let data = batchData(e)
    let selection = selectAssay(e)
    console.log(selection)

    let response = await fetch('http://127.0.0.1:8000/api/batches/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        "assay": selection, "numberOfSamples": e.target.samples.value, 
        "batchDate": date, "dna_extraction": e.target.dna.value === "" ? null : e.target.dna.value,
        "rna_extraction": e.target.rna.value === "" ? null : e.target.rna.value, "fieldLabels": data
      })
    })
    if(response.status === 201) {
      console.log('batch created successfully')
      navigate('/')
    } else {
      alert('error')
    }
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
    console.log(document.getElementById('dna')) //help
   
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

    //configure
    if (chosenAssay.group.length === 0) {
      if (chosenAssay.type === 'DNA') {
        setDNA(false)
      }
      if (chosenAssay.type === 'RNA' || chosenAssay.type === 'Total nucleic') {
        setRNA(false)
      }
    } else if (chosenAssay.group.length >= 0) {
      for (let i=0; i<chosenAssay.group.length; i++) {
        if (chosenAssay.group[i].type === 'DNA') {
          setDNA(false)
        }
        if (chosenAssay.group[i].type === 'RNA' || chosenAssay.group[i].type === 'Total nucleic') {
          setRNA(false)
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
              <Form.Select name="assay" aria-label="Default select example" onChange={chooseAssay} >
                <option>Choose Assay</option>
                {assays.map(assay => (
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
            <Form.Control name="dna" type="text" required={dna===false ? true : false} placeholder={dna===true ? "Not Required" : "Enter DNA Extraction Group"} disabled={dna}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>RNA/Total-Nucleic Group</Form.Label>
            <Form.Control name="rna" type="text" required={dna===false ? true : false} placeholder={rna===true ? "Not Required" : "Enter RNA/Total Nucleic Extraction Group"} disabled={rna}/>
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
          <Button type="submit" variant="primary">Create Batch</Button>
        </Form>
      </Col>
    </Container>
  )
}

export default CreateBatch