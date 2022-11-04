import React, { useContext } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/esm/Row"
import { useLocation } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const EditAssay = () => {

  const location = useLocation()

  let {authTokens} = useContext(AuthContext)

  let updateAssay = async (e) => {
    e.preventDefault()

    let response = await fetch(`http://127.0.0.1:8000/api/batches/${location.state.assay.pk}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        // 'assay':selectedBatch.assay, 
        // 'numberOfSamples':e.target.samples.value,
        // 'dna_extraction': e.target.dna.value,
        // 'rna_extraction': e.target.rna.value,
        // 'fieldLabels': labelData
      })
    })
    if(response.status === 200) {
      console.log('batch updated')

    } else {
      alert('error')
    }
  } 

  let deleteAssay = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/batches/${location.state.assay.pk}/destroy/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if(response.status === 204) {
      console.log('batch deleted')

    } else {
      alert('error')
    }
  }


  return (
    <Container>
      <Row>
        <Col>
          Edit Assay
        </Col>
      </Row>
    </Container>
  )

}

export default EditAssay;