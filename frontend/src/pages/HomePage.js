import React from 'react'
import ListAssay from '../assays/ListAssay'
import ListBatch from '../batches/ListBatch'

const HomePage = () => {

  return (
    <div>
      <p>You are logged to the home page!</p>
      Batches
      <ListBatch/>
    </div>
  )
}

export default HomePage