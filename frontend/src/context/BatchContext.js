import { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'

const BatchesContext = createContext()

export default BatchesContext

export const BatchesProvider = ({children}) => {

  let {authTokens, logoutUser} = useContext(AuthContext)
  let [batches, setBatches] = useState([])
  let [labels, setLabels] = useState([])
  let [updating, setUpdating] = useState(false)

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

  useEffect(() => {
    setUpdating(false)
    getBatches()
    getLabels()
    // eslint-disable-next-line 
  }, [updating])

  let contextData = {
    getBatches: getBatches,
    batches: batches,
    getLabels: getLabels,
    labels: labels,
    setUpdating: setUpdating,
    updating: updating,
  }

  return (
    <BatchesContext.Provider value={contextData}>
      {children}
    </BatchesContext.Provider>
  )

}