import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Table from '../components/Table'
import styled from 'styled-components'

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

  let [batches, setBatches] = useState([]) //built in models
  let {authTokens, logoutUser} = useContext(AuthContext)
  let [labels, setLabels] = useState([])
  
  useEffect(() => {
    getBatches()
    getLabels()
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
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  let getLabels = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/labels/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()
    if(response.status === 200) {
      setLabels(data)
    } else {
      alert('error')
    }
  }

  let createColumns = () => {
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
      }
    ]

    labels.forEach(label => {
      columns.push({Header: `${label.label}`, accessor: `fieldLabels.${label.label}`})
    })
    return columns
  }

  return (
    <Styles>
      <Table columns={createColumns()} data={batches} />
    </Styles>
  )
}

export default ListBatch