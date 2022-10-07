import { date } from "faker/lib/locales/ar"
import React, { useState } from "react"

const CreateBatch = () => {
  let [batches, setBatches] = useState([])



  let addBatches = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/batches/create', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({
        assay: this.state.code,
        numberOfSamples: samples,
        batchDate: date,
        miscFields: [],

      }), //enter assay code here
    })
  }

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Disabled input</Form.Label>
        <Form.Control placeholder="Disabled input" disabled />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Disabled select menu</Form.Label>
        <Form.Select disabled>
          <option>Disabled select</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Can't check this" disabled />
      </Form.Group>
    </>
  )



}