import { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'

const AssayContext = createContext()

export default AssayContext

export const AssayProvider = ({children}) => {

  let {authTokens} = useContext(AuthContext)
  let [assays, setAssays] = useState([])
  let [updating, setUpdating] = useState(false)

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
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    setUpdating(false)
    getAssays()
    // eslint-disable-next-line
  }, [updating])

  let contextData = {
    getAssays: getAssays,
    assays: assays,
    setUpdating: setUpdating,
    updating: updating,
  }

  return (
    <AssayContext.Provider value={contextData}>
      {children}
    </AssayContext.Provider>
  )
}