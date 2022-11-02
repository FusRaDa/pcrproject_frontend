import React, { useState, useContext, useRef} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from "react-bootstrap/esm/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Button from 'react-bootstrap/esm/Button';

import AssayContext from '../context/AssayContext'
import CreateAssay from './CreateAssay';


const ListAssay = () => {

  //global
  let {assays} = useContext(AssayContext)

  //child - CreateAssay.js
  let [isGroup, setIsGroup] = useState(false)
  let [addedAssays, setAddedAssays] = useState([])
  let [pkArray, setPkArray] = useState([])

  //local
  let [groupAssays, setGroupAssays] = useState(false)
  // let [viewAssay, setViewAssay] = useState(null)
  let [search, setSearch] = useState("")
  let [createAssay, setCreateAssay] = useState(false)

  // let chooseAssay = (pk) => {
  //   for (let i=0; i<assays.length; i++) {
  //     //ignore eslint warning
  //     // eslint-disable-next-line
  //     if (assays[i].pk == pk) {
  //       setViewAssay(assays[i])
  //     }
  //   }
  // }

  let controlAssaySelection = (assay) => {
    if (document.getElementById(`${assay.pk}`).checked) {
      console.log('add')
    } else {
      console.log('remove')
    }
  }

  let addAssayToGroup = (assay) => {
    setAddedAssays(addedAssays.push(assay))
    setPkArray(pkArray.push(assay.pk))
  }

  let removeAssayFromGroup = (assay) => {
    for (var i=0; i < addedAssays; i++) {
      if (addedAssays[i].pk === assay.pk) {
        setAddedAssays(addedAssays.splice(i, 1))
        setPkArray(pkArray.splice(i, 1))
      }
    }
  }

  let searchAssay = () => {
    let data = document.getElementById('search').value
    setSearch(data.toLowerCase())
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Form.Label>{!groupAssays ? "Individual Assays" : "Group Assays"}</Form.Label>
          <Button onClick={() => setCreateAssay(!createAssay)}>Create Assay</Button>

          <Form className="d-flex" onChange={() => searchAssay()}>
            <Form.Control
              type="search"
              placeholder="Search"
              id="search"
            />
            <Button type="submit" variant="outline-success">Search</Button>
            <Button onClick={() => setGroupAssays(!groupAssays)}>{!groupAssays ? "View Group Assays" : "View Individual Assays"}</Button>
          </Form>




          {!groupAssays && <ListGroup>
            {assays
              //allow assays clicked to be edited/details and added to group assay
              .filter(assay => assay.group.length === 0)
              .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
              .map(assay => (
                <ListGroup.Item key={assay.pk}>
                  {`${assay.code}-${assay.name}`}
                  {isGroup && <ToggleButtonGroup type="checkbox" defaultValue={pkArray} onChange={(e) => controlAssaySelection(assay)}>
                    <ToggleButton id={assay.pk} value={assay.pk} onChange={(e) => console.log(e.target.checked)}>
                      CHANGE TEXT
                    </ToggleButton>
                  </ToggleButtonGroup>}
                </ListGroup.Item>
              ))}
          </ListGroup>}



          {groupAssays && <ListGroup>
          {assays
            .filter(assay => assay.group.length > 1)
            .filter(assay => search !== null ? assay.name.toLowerCase().includes(search) || assay.code.includes(search) : assay)
            .map(assay => (
              <ListGroup.Item key={assay.pk}>
                {`${assay.code}-${assay.name}`}
              </ListGroup.Item>
          ))}
          </ListGroup>}
        </Col>
        
    
        {createAssay && <Col>
          <CreateAssay 
            isGroup={isGroup} setIsGroup={setIsGroup} 
            addedAssays={addedAssays} setAddedAssays={setAddedAssays}
            pkArray={pkArray} setPkArray={setPkArray}/>

        </Col>}
      </Row>
    </Container>
  )
}

export default ListAssay