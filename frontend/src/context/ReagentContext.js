import { createContext, useContext, useEffect, useState } from 'react'
import ServerAddress from '../ServerAddress'
import AuthContext from './AuthContext'

const ReagentContext = createContext()

export default ReagentContext

export const ReagentProvider = ({children}) => {

  let {authTokens} = useContext(AuthContext)
  let [reagents, setReagents] = useState([])
  let [updating, setUpdating] = useState(false)

  let getReagents = async () => {
    let response = await fetch(`${ServerAddress}/api/reagents/`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
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
    getReagents()
    // eslint-disable-next-line
  }, [updating])

  let contextData = {
    getReagents: getReagents,
    reagents: reagents,
    setUpdating: setUpdating,
    updating: updating,
  }

  return (
    <ReagentContext.Provider value={contextData}>
      {children}
    </ReagentContext.Provider>
  )
}