import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import BatchTable from '../components/BatchTable'
import styled from 'styled-components'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
  const navigate = useNavigate()
  let {batches, labels} = useContext(BatchContext)

  let [editing, setEditing] = useState(false)
  let [fullSheet, setFullSheet] = useState(true)
  let [rowClicked, setRowClicked] = useState(null)
  let [selectedBatch, setSelectedBatch] = useState(null)

  let [labelData, setLabelData] = useState([])

  //replace underscore with spaces for header column
  let spaceLabels = (string) => {
    return string.replace(/_+/g, ' ').trim()
  }

  useEffect(() => {
    let data = labels.map(label => {
      return {Header: `${spaceLabels(label.label)}`, accessor: `fieldLabels.${label.label}`}
    })
    setLabelData(data)
  }, [labels])

  let renderColumns = () => {
    let columns = [
      {
        Header: 'Batch Info',
        columns: [
          {
            Header: 'pk',
            accessor: 'pk'
          },
          {
            Header: 'Assay',
            accessor: 'assay.name',
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
        ],
      },
      {
        Header: 'Additional Info',
        columns: labelData
      },
    ]
    return columns
  }
 
  useEffect(() => {
    if (selectedBatch !== null) {
      setEditing(true)
    } 
  },[selectedBatch])

  let resetSelections = () => {
    setRowClicked(null)
  }

  return (
    <Container>
      <Row>
        <Col onClick={() => {setFullSheet(!fullSheet); resetSelections()}}>Master Sheet</Col>
        <Col>Edit Labels</Col>
        <Col onClick={() => navigate('/create')}>Create Batch</Col>
      </Row>
      <Row>
        <Col>
          <Styles>
            <BatchTable 
              columns={renderColumns()} 
              data={batches} 
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              setEditing={setEditing} 
              setFullSheet={setFullSheet}
              rowClicked={rowClicked}
              setRowClicked={setRowClicked}/>
          </Styles>
        </Col>

        {!fullSheet && 
        <Col id='batch_screen'>
          {editing && <EditBatch selectedBatch={selectedBatch} setEditing={setEditing}/>}
        </Col>}
      </Row>
    </Container>
  )
}

export default ListBatch