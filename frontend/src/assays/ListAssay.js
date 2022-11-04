import React, { useState, useContext} from 'react'
import { useNavigate } from "react-router-dom"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from "react-bootstrap/esm/Container"
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/Card';

import AssayContext from '../context/AssayContext'

const ListAssay = () => {

  //global
  let {assays} = useContext(AssayContext)

  //local
  let [groupAssays, setGroupAssays] = useState(false)
  let [search, setSearch] = useState("")
  let [assay, setAssay] = useState(null)

  const navigate = useNavigate()

  // let chooseAssay = (pk) => {
  //   for (let i=0; i<assays.length; i++) {
  //     //ignore eslint warning
  //     // eslint-disable-next-line
  //     if (assays[i].pk == pk) {
  //       setViewAssay(assays[i])
  //     }
  //   }
  // }

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Container>
      
            <Button onClick={() => setGroupAssays(!groupAssays)}>{!groupAssays ? "View Group Assays" : "View Individual Assays"}</Button>
            <Button onClick={() => navigate('/assay/create')}>Create Assay</Button>

            <Form className="d-flex" onChange={() => searchAssay()}>
              <Form.Control
                type="search"
                placeholder={!groupAssays ? "Search for Individual Assays" : "Search for Group Assays"}
                id="search"
              />
            </Form>

            {!groupAssays && 
            <ListGroup>
              {assays
                //allow assays clicked to be edited/details and added to group assay
                .filter(assay => assay.assays.length === 0)
                .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
                .map(assay => (
                  <ListGroup.Item key={assay.pk} action variant="secondary" onClick={() => setAssay(assay)}>
                    {`${assay.code}-${assay.name}`}
                  </ListGroup.Item>
                ))}
            </ListGroup>}

            {groupAssays && <ListGroup>
            {assays
              .filter(assay => assay.assays.length > 1)
              .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
              .map(assay => (
                <ListGroup.Item key={assay.pk} action variant="secondary" onClick={() => setAssay(assay)}>
                  {`${assay.code}-${assay.name}`}
                </ListGroup.Item>
            ))}
            </ListGroup>}
          </Container>
        </Col>

        <Col>
          <Container>

            {assay !== null && 
            <Card border="secondary">
              <Card.Header>Assay Details</Card.Header>
              <ListGroup>
                <ListGroup.Item>Name: {assay.name}</ListGroup.Item>
                <ListGroup.Item>Code: {assay.code}</ListGroup.Item>
                <ListGroup.Item>Type: {assay.type}</ListGroup.Item>
                  {assay.assays.length > 1 && 
                  <ListGroup>
                    Grouped Assays
                    {assay.assays.map(a => (
                      <ListGroup.Item key={a.pk}>
                        {a.name}
                      </ListGroup.Item>))}
                  </ListGroup>}

                  {!groupAssays && 
                  <ListGroup>
                    Reagents
                    {assay.reagent.map(r => (
                      <ListGroup.Item key={r.pk}>
                        {r.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>}

                  {!groupAssays && 
                  <ListGroup>
                    Supplies
                    {assay.supply.map(s => (
                      <ListGroup.Item key={s.pk}>
                        {s.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>}
              </ListGroup>
              <Button onClick={() => navigate(`/assay/edit/${assay.pk}`, {state: {assay:assay}})}>Edit this Assay</Button>
            </Card>}

            {assay === null && 
            <Card border="secondary">
              <Card.Header>Assay Details</Card.Header>
              <Card.Text>
                Choose an assay to view details
              </Card.Text>
            </Card>}

          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default ListAssay