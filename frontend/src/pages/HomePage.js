import React from 'react'
import { Link } from 'react-router-dom'
import ListAssay from '../assays/ListAssay'
import BatchLabels from '../batches/BatchLabels'
import CreateBatch from '../batches/CreateBatch'
import ListBatch from '../batches/ListBatch'

const HomePage = () => {
  return (
    <div>
      <p>You are logged to the home page!</p>
      <ListBatch/>
      <Link to="/create_batch">Add Batch</Link>

    </div>
  )
}

export default HomePage