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
import Offcanvas from 'react-bootstrap/Offcanvas';


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

  //modal and offcanvas
  let [show, setShow] = useState(false)
  let [guide, setGuide] = useState(true)


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

  const handleClose = () => setGuide(false);
  const handleShow = () => setGuide(true);


  return (
    <Container fluid style={{marginTop: '5px'}}>
      <Row>
        <Col>
          <Button onClick={() => setShow(true)}>Add/Edit Label Columns</Button>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'right'}}>
          <Button variant='warning' style={{position: 'fixed'}} onClick={handleShow}>
            Guide
          </Button>
        </Col>
      </Row>

      <Offcanvas placement='end' show={guide} onHide={handleClose} backdrop={false} scroll={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Step-by-step Guide - Batches</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <p>This project serves as a way to track PCR information for diagnostic laboratories. Follow these steps to learn how to use my application!</p>

          <h5>Step: 1 - Create a Batch</h5>
          <ol>
            <li>Select an assay from the list on the right.</li>
            <li>Enter number of samples being processed.</li>
            <li>Create a unique three letter code for the extraction group.</li>
            <li>Add additional information to relevant fields.</li>
          </ol> 

          <h5>Step: 2 - Update Batch Information</h5>
          <ol>
            <li>Double click on a cell and enter new data.</li>
            <li>Press enter to save changes.</li>
            <li>Cells under batch date, assay, and code cannot be modified. As well as cells that are empty under the extraction group columns.</li>
          </ol> 

          <h5>Step: 3 - Edit Dynamic Columns</h5>
          <ol>
            <li>You can also move columns by pressing the left or right arrow buttons at the top of each column.</li>
            <li>Press button labeled: Add/Edit Label Columns</li>
            <li>To update a column, click edit, change column name, and press update.</li>
            <li>Press delete to remove columns from table.</li>
            <li>You may also add a new column by typing a name and clicking add.</li>
          </ol> 

          <h5>Step: 4 - Access Assays</h5>
          <ol>
            <li>You may also create your own assays by clicking on the Assays tab at the top of the page.</li>
          </ol> 

        
        
        </Offcanvas.Body>
      </Offcanvas>

      <Row style={{marginTop: '5px'}}>
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
      </Row>

      <Row style={{marginTop: '50px'}}>
        <CreateBatch/>
      </Row>
   
      <Modal show={show} onHide={() => setShow(false)} dialogClassName="batch-modal" centered>

        <Modal.Header closeButton>
          <Modal.Title>
            Additional Label Columns
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <BatchLabels/>
        </Modal.Body>
    
      </Modal>

    </Container>
  )
}

export default ListBatch