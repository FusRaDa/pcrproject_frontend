import { createContext, useContext, useEffect, useState } from 'react'
import ServerAddress from '../ServerAddress'
import AuthContext from './AuthContext'

const BatchContext = createContext()

export default BatchContext

export const BatchProvider = ({children}) => {

  let {authTokens, logoutUser} = useContext(AuthContext)
  let [batches, setBatches] = useState([])
  let [labels, setLabels] = useState([])
  let [updating, setUpdating] = useState(false)

  let page = localStorage.getItem('currentPage')
  let [pageNum, setPageNum] = useState(page)

  let getBatches = async () => {

    if (pageNum !== null) {
      let response = await fetch(`${ServerAddress}/api/batches/?page=${+pageNum + 1}`, {
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
    } else {
      let response = await fetch(`${ServerAddress}/api/batches/`, {
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
  }

  let getLabels = async () => {
    let response = await fetch(`${ServerAddress}/api/labels/`, {
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
    setPageNum: setPageNum,
  }

  return (
    <BatchContext.Provider value={contextData}>
      {children}
    </BatchContext.Provider>
  )

}