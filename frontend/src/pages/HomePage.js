import React from 'react'
import ListAssay from '../assays/ListAssay'
import AddBatchLabels from '../batches/AddBatchLabels'
import ListBatch from '../batches/ListBatch'

const HomePage = () => {

  return (
    <div>
      <p>You are logged to the home page!</p>
      <AddBatchLabels/>
    </div>
  )
}

export default HomePage