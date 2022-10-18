import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'

const ListBatch = () => {

  let [batches, setBatches] = useState([]) //built in models
  let {authTokens, logoutUser} = useContext(AuthContext)
  
  useEffect(() => {
    getBatches()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let getBatches = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/batches/', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    if(response.status === 200) {
      setBatches(data)
      console.log(data)
    
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  const nullChecker = cell => (!cell ? "NA" : cell)

  const columns = [
    { text: 'Primary Key', dataField: 'pk', hidden: true},
    { text: 'Assay Code', dataField: 'assay.code', formatter: nullChecker },
    { text: 'Assay Name', dataField: 'assay.name', formatter: nullChecker },
    { text: '# of Samples', dataField: 'numberOfSamples', formatter: nullChecker },
    { text: 'Batch Made', dataField: 'batchDate', formatter: nullChecker },

    { text: 'Price', dataField: 'fieldLabels.Price', formatter: nullChecker },
    { text: 'Color', dataField: 'fieldLabels.Color', formatter: nullChecker, filter: textFilter()},
    { text: 'Size', dataField: 'fieldLabels.Size', formatter: nullChecker },
    { text: 'Height', dataField: 'fieldLabels.Height', formatter: nullChecker },

    { text: 'Batch Processed', dataField: 'isBatchProcessed', formatter: nullChecker }
  ]

  return (
    <div style={{ maxWidth: '100%' }}>
      <BootstrapTable columns={columns} data={batches} keyField="pk" filter={filterFactory()} />
    </div>
  )
}

export default ListBatch