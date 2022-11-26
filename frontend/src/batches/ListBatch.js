import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';

//components
import BatchTable from '../components/BatchTable';
import BatchContext from '../context/BatchContext';
import NumberRangeColumnFilter from '../components/NumberRangeColumnFilter';
import SelectColumnFilter from '../components/SelectColumnFilter';
import CreateBatch from './CreateBatch';
import BatchLabels from './BatchLabels';

//style
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const ListBatch = () => {
  let {setPageNum, setUpdating, batches, labels} = useContext(BatchContext)

  let [rowClicked, setRowClicked] = useState(null)
  let [columns, setColumns] = useState([])

  //pagination
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(false)
  let [pageCount, setPageCount] = useState(0)
  let fetchIdRef = useRef(0)

  let [isEdit, setIsEdit] = useState(false)

  let [show, setShow] = useState(false)

  let changePage = (pageIndex) => {
    setPageNum(pageIndex)
    setUpdating(true)
  }

  let fetchData = useCallback(() => {
    const fetchId = ++fetchIdRef.current

    setLoading(true)

    if (Object.keys(batches).length !== 0 && fetchId === fetchIdRef.current) {
      setData(batches.results)
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
        Header: 'Batch Date Created',
        accessor: 'batchDate',
        //TODO: add sort by date filter
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
    <Container fluid style={{marginTop: '10px'}}>
      <Row>
        <Col>
          <OverlayTrigger placement='right'
            overlay={popover("Dynamic Table", "Part of this table can be modified. Columns such as assay and # of samples are mandatory fields and therefore cannot be edited.")}>
            <Button onClick={() => setShow(true)}>Add/Edit Label Columns</Button>
          </OverlayTrigger>
        </Col>
      </Row>

      <Row>
        <OverlayTrigger placement='bottom'
          overlay={popover(
            "React-Table Guide", 
            "For existing rows, double click on a cell to edit information and press enter to update. " +  
            "You may rearrange columns by pressing left/right. You can also use the search tool (S).")}>
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
              changePage={changePage}
            />
          </Col>
        </OverlayTrigger>
      </Row>

      <OverlayTrigger placement='top' overlay={popover("Create New Batch", "Select an assay from a list to include in the batch. To edit/add assays click on assays on top of page.")}>
        <Row style={{marginTop: '50px'}}>
          <CreateBatch/>
        </Row>
      </OverlayTrigger>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="batch-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Additional Label Columns
          </Modal.Title>
        </Modal.Header>
        <OverlayTrigger placement='bottom' overlay={popover("Manage Columns", "You may add more columns and delete columns." + 
          " Be aware that changing column names will not show data if there is no previous data pointing to the exact name of column")}>
          <Modal.Body>
            <BatchLabels/>
          </Modal.Body>
        </OverlayTrigger>
      </Modal>

   
    </Container>
  )
}

export default ListBatch