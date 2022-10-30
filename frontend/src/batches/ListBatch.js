import React, { useContext, useState } from 'react'
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

  let getBatchPk = (pk) => {
    setPk(pk)
  } 

  return (
    <Container>
      <Row>
        <Col>Master Sheet</Col>
        <Col>Modify Batch</Col>
      </Row>
      <Row>
        <Col>
          <Styles>
            <BatchTable columns={createColumns(labels)} data={batches} setEditing={setEditing} getBatchPk={getBatchPk}/>
          </Styles>
        </Col>
        <Col>
          {!editing && <CreateBatch />}
          {editing && <EditBatch pk={pk} setEditing={setEditing}/>}
        </Col>
      </Row>
    </Container>
  )
}

export default ListBatch