import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

const ListAssay = () => {

  let [assays, setAssays] = useState([])
  let {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(() => {
    getAssays()
    // eslint-disable-next-line
  }, [])

  let getAssays = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/assays/', {
      method: 'GET', 
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    if (response.status === 200) {
      setAssays(data)
      console.log(data)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  return (
    <div>
      <ul>
        {assays.map(assay => (
          <Row key={assay.pk}>
            <Col>Assay Name: {assay.name}</Col>
            <Col>Assay Code: {assay.code}</Col>
      

            <Link to={`/edit_assay/${assay.pk}`}>Edit</Link>
          </Row>
        ))}
        <Link to='/assay/create_assay'>Add Assay</Link>
      </ul>
    </div>
  )
}

export default ListAssay