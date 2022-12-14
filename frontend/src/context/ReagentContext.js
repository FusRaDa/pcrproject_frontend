import { createContext, useContext, useEffect, useState } from 'react'
import ServerAddress from '../ServerAddress'
import AuthContext from './AuthContext'

const ReagentContext = createContext()

export default ReagentContext

export const ReagentProvider = ({children}) => {

  let {authTokens, user, logoutUser} = useContext(AuthContext)
  let [reagents, setReagents] = useState([])
  let [updating, setUpdating] = useState(false)

  let [initializeReagents, setInitializeReagents] = useState(false)

  let getReagents = async () => {
    let response = await fetch(`${ServerAddress}/api/reagents/`, {
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
      setReagents(data)
      console.log(data)
    } else {
      alert('error')
    }
  }

  useEffect(() => {
    setUpdating(false)
    setInitializeReagents(false)
    if (user) {
      getReagents()
    }
    // eslint-disable-next-line
  }, [updating, initializeReagents])

  let contextData = {
    getReagents: getReagents,
    reagents: reagents,
    setUpdating: setUpdating,
    updating: updating,
    setInitializeReagents: setInitializeReagents,
  }

  return (
    <ReagentContext.Provider value={contextData}>
      {children}
    </ReagentContext.Provider>
  )
}