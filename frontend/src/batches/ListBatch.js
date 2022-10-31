import React, { useContext, useEffect, useState } from 'react'
import BatchTable from '../components/BatchTable'
import styled from 'styled-components'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CreateBatch from './CreateBatch';
import BatchContext from '../context/BatchContext';
import EditBatch from './EditBatch';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tbody tr:hover {
      background-color: grey;
      color: white;
      cursor: pointer;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const ListBatch = () => {
  let {batches, labels} = useContext(BatchContext)

  let [editing, setEditing] = useState(false)
  let [pk, setPk] = useState(null)

  let [fullSheet, setFullSheet] = useState(true)
  let [rowClicked, setRowClicked] = useState(null)


  //replace underscore with spaces for header column
  let spaceLabels = (string) => {
    return string.replace(/_+/g, ' ').trim()
  }

  let createColumns = (labels) => {
    const columns = [
      {
        Header: 'pk',
        accessor: 'pk'
      },
      {
        Header: 'Assay',
        accessor: 'assay.name'
      },
      {
        Header: 'Code',
        accessor: 'assay.code'
      },
      {
        Header: '# of Samples',
        accessor: 'numberOfSamples'
      },
      {
        Header: 'DNA Extraction Group',
        accessor: 'dna_extraction'
      },
      {
        Header: 'RNA/Total-Nucleic Extraction Group',
        accessor: 'rna_extraction'
      }
    ]

    labels.forEach(label => {
      columns.push({Header: `${spaceLabels(label.label)}`, accessor: `fieldLabels.${label.label}`})
    })
    return columns
  }

  useEffect(() => {
    if (pk !== null) {
      setEditing(true)
    } 
  },[pk])

  let resetSelections = () => {
    setPk(null)
    setRowClicked(null)
  }

  return (
    <Container>
      <Row>
        <Col onClick={() => {setFullSheet(!fullSheet); resetSelections()}}>Master Sheet</Col>
        <Col>Edit Labels</Col>
        <Col onClick={() => {setEditing(false); setFullSheet(false); resetSelections()}}>Create Batch</Col>
      </Row>
      <Row>
        <Col>
          <Styles>
            <BatchTable 
              columns={createColumns(labels)} 
              data={batches} pk={pk} 
              setPk={setPk} setEditing={setEditing} 
              setFullSheet={setFullSheet}
              rowClicked={rowClicked}
              setRowClicked={setRowClicked}/>
          </Styles>
        </Col>
        {!fullSheet && <Col id='batch_screen'>
          {!editing && <CreateBatch />}
          {editing && <EditBatch pk={pk} setEditing={setEditing}/>}
        </Col>}
      </Row>
    </Container>
  )
}

export default ListBatch