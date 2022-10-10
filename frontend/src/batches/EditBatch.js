import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import BatchContext from "../context/BatchContext";

const EditBatch = () => {
  let {getBatch} = useContext(BatchContext)
  const params = useParams()
  getBatch(params.pk)

  return (
    <div>edit</div>
  )
}

export default EditBatch