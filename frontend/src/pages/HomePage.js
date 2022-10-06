import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
  // let [notes, setNotes] = useState([])
  let [batches, setBatches] = useState([])
  let {authTokens, logoutUser} = useContext(AuthContext)


  useEffect(() => {
    getBatches()
  }, [])

  // let getNotes = async () => {
  //   let response = await fetch('http://127.0.0.1:8000/api/notes/', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type':'application/json',
  //       'Authorization':'Bearer ' + String(authTokens.access)
  //     }
  //   })
  //   let data = await response.json()
  //   if(response.status === 200) {
  //     setNotes(data)
  //   } else if (response.statusText === 'Unauthorized') {
  //     logoutUser()
  //   }
  // }

  let getBatches = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/batches/', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    console.log(data)
    if(response.status === 200) {
      setBatches(data)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  return (
    <div>
      <p>You are logged to the home page!</p>

      <ul>
        {batches.map(batch => (
          <li key={batch.pk}>
            <div>{batch.assay}</div>
            <div>{batch.numberOfSamples}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage