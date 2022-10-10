import React, { useContext } from "react"
import BatchContext from "../context/BatchContext"

const CreateBatch = () => {

  let {addBatch} = useContext(BatchContext)

  return (
    <div>
      <form onSubmit={addBatch}>
        <input type="text" name="assay" placeholder="Enter Assay Code"/>
        <input type="text" name="numberOfSamples" placeholder="Enter Number Of Samples"/>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default CreateBatch