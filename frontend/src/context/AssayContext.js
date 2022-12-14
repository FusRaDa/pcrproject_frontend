import { createContext, useContext, useEffect, useState } from 'react'
import ServerAddress from '../ServerAddress'
import AuthContext from './AuthContext'

const AssayContext = createContext()

export default AssayContext

export const AssayProvider = ({children}) => {

  let {authTokens, user, logoutUser} = useContext(AuthContext)
  let [assays, setAssays] = useState([])
  let [updating, setUpdating] = useState(false)

  let [initializeAssays, setInitializeAssays] = useState(false)

  let getAssays = async () => {
    let response = await fetch(`${ServerAddress}/api/assays/`, {
      method: 'GET', 
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    .catch(() => {
      logoutUser()
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
    setInitializeAssays(false)
    if (user) {
      getAssays()
    }
    // eslint-disable-next-line
  }, [updating, initializeAssays])

  let contextData = {
    getAssays: getAssays,
    assays: assays,
    setUpdating: setUpdating,
    updating: updating,
    setInitializeAssays: setInitializeAssays,
  }

  return (
    <AssayContext.Provider value={contextData}>
      {children}
    </AssayContext.Provider>
  )
}