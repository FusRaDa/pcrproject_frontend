import React, { useContext, useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import BatchContext from "../context/BatchContext";

const EditBatch = () => {
  let {getBatch, batch} = useContext(BatchContext)
  const params = useParams()

  useEffect(() => {
    getBatch(params.pk)
    // eslint-disable-next-line
  }, [])

  return (
    <Row>
      <Col>{batch.numberOfSamples}</Col>
    </Row>
  )
}

export default EditBatch