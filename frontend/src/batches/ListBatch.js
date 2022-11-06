import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom"
import BatchTable from '../components/BatchTable'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BatchContext from '../context/BatchContext';
import EditBatch from './EditBatch';
import NumberRangeColumnFilter from '../components/NumberRangeColumnFilter';
import SelectColumnFilter from '../components/SelectColumnFilter';

const ListBatch = () => {
  const navigate = useNavigate()
  let {batches, labels} = useContext(BatchContext)

  let [editing, setEditing] = useState(false)
  let [rowClicked, setRowClicked] = useState(null)
  let [selectedBatch, setSelectedBatch] = useState(null)

  let [labelData, setLabelData] = useState([])

  let [data, setData] = useState([])
  let [loading, setLoading] = useState(false)
  let [pageCount, setPageCount] = useState(0)
  let fetchIdRef = useRef(0)

  let fetchData = useCallback(({ pageSize, pageIndex }) => {
      const fetchId = ++fetchIdRef.current

      setLoading(true)

      if (Object.keys(batches).length !== 0 && fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        setData(batches.results.slice(startRow, endRow))
        setPageCount(batches.total_pages)
        setLoading(false)
      }
    }, [batches]
  )
  
  //replace underscore with spaces for header column
  let spaceLabels = (string) => {
    return string.replace(/_+/g, ' ').trim()
  }

  useEffect(() => {
    let data = labels.map(label => {
      return {Header: `${spaceLabels(label.label)}`, accessor: `results.fieldLabels.${label.label}`}
    })
    setLabelData(data)
  }, [labels, batches])

  let renderColumns = () => {
    let columns = [
      {
        Header: 'Batch Info',
        columns: [
          {
            Header: 'pk',
            accessor: 'pk',
          },
          {
            Header: 'Assay',
            accessor: 'assay.name',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Code',
            accessor: 'assay.code',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: '# of Samples',
            accessor: 'numberOfSamples',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
          },
          {
            Header: 'DNA Extraction Group',
            accessor: 'dna_extraction',
          },
          {
            Header: 'RNA/Total-Nucleic Extraction Group',
            accessor: 'rna_extraction',
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
    setEditing(false)
  }

  return (
    <Container fluid>
      <Row>
        <Col onClick={() => resetSelections()}>Master Sheet</Col>
        <Col>Edit Labels</Col>
        <Col onClick={() => navigate('/create')}>Create Batch</Col>
      </Row>
      
      <Row>
        <Col>
          <BatchTable 
            columns={renderColumns()} 
            data={data} 
            setSelectedBatch={setSelectedBatch}
            setEditing={setEditing} 
            rowClicked={rowClicked}
            setRowClicked={setRowClicked}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
          />
        </Col>

        {editing && 
        <Col xs={3} id='batch_screen'>
          <EditBatch 
            selectedBatch={selectedBatch} 
            setEditing={setEditing}
          />
        </Col>}

      </Row>
    </Container>
  )
}

export default ListBatch