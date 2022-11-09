import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom"
import BatchTable from '../components/BatchTable'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BatchContext from '../context/BatchContext';
import NumberRangeColumnFilter from '../components/NumberRangeColumnFilter';
import SelectColumnFilter from '../components/SelectColumnFilter';
import CreateBatch from './CreateBatch';

const ListBatch = () => {
  const navigate = useNavigate()
  let {batches, labels} = useContext(BatchContext)

  let [rowClicked, setRowClicked] = useState(null)
  let [columns, setColumns] = useState([])

  let [data, setData] = useState([])
  let [loading, setLoading] = useState(false)
  let [pageCount, setPageCount] = useState(0)
  let fetchIdRef = useRef(0)

  let [isEdit, setIsEdit] = useState(false)

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

  useEffect(() => {
    let data = labels.map(label => {
      return {Header: `${spaceLabels(label.label)}`, accessor: `fieldLabels.${label.label}`}
    })
    setColumns(renderColumns(data))
  }, [labels])
  
  //replace underscore with spaces for header column
  let spaceLabels = (string) => {
    return string.replace(/_+/g, ' ').trim()
  }

  let renderColumns = (data) => {
    let columns = [
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
      },
    ]
    let newColumn = columns.concat(data)
    return newColumn
  }

  let resetSelections = () => {
    setRowClicked(null)
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
            columns={columns} 
            data={data} 
            rowClicked={rowClicked}
            setRowClicked={setRowClicked}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </Col>
      </Row>
      <Row>
        <CreateBatch/>
      </Row>
    </Container>
  )
}

export default ListBatch