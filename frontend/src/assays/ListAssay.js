import React, { useState, useContext} from 'react'
import { useNavigate } from "react-router-dom"
import AssayContext from '../context/AssayContext'

//styles
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from "react-bootstrap/esm/Container"
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/Card';

const ListAssay = () => {

  //global
  let {assays} = useContext(AssayContext)

  //local
  let [groupAssays, setGroupAssays] = useState(false)
  let [search, setSearch] = useState("")
  let [assay, setAssay] = useState(null)

  const navigate = useNavigate()

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  let popover = (title, info) => {
    return (
      <Popover>
        <Popover.Header style={{backgroundColor: 'red'}}>
          {title}
        </Popover.Header>
        <Popover.Body>
          {info}
        </Popover.Body>
      </Popover>
    )
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Container>

            <OverlayTrigger placement='bottom' 
              overlay={popover("Individual vs Group Assays", "Individual assays consist of one assay with a list of reagents and supplies. " + 
              "Group assays consist of multiple assays under one name and code and does not have a list of reagents and supplies.")}>
              <Button onClick={() => setGroupAssays(!groupAssays)}>{!groupAssays ? "View Group Assays" : "View Individual Assays"}</Button>
            </OverlayTrigger>
      
            <OverlayTrigger placement='bottom'
              overlay={popover("Create an Assay", "You may create an individual or group assay. For individual assays: select reagents and supplies. For group assays: select assays to group up")}>
              <Button onClick={() => navigate('/assay/create')}>Create Individual Assay</Button>
            </OverlayTrigger>

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
                .filter(assay => assay.assay.length === 0)
                .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
                .map(assay => (
                  <ListGroup.Item key={assay.pk} action variant="secondary" onClick={() => {setAssay(assay); console.log(assay)}}>
                    {`${assay.code}-${assay.name}`}
                  </ListGroup.Item>
                ))}
            </ListGroup>}

            {groupAssays && <ListGroup>
            {assays
              .filter(assay => assay.assay.length > 1)
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
                  {assay.assay.length > 1 && 
                  <ListGroup>
                    Grouped Assays
                    {assay.assay.map(a => (
                      <ListGroup.Item key={`assay_${a.pk}`}>
                        {a.name}
                      </ListGroup.Item>))}
                  </ListGroup>}
                
                {/* 
                  {!groupAssays && 
                  <ListGroup>
                    Reagents
                    {assay.reagent.map(r => (
                      <ListGroup.Item key={`reagent_${r.pk}`}>
                        {r.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>}

                  {!groupAssays && 
                  <ListGroup>
                    Supplies
                    {assay.supply.map(s => (
                      <ListGroup.Item key={`supply_${s.pk}`}>
                        {s.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>} */}
                  
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