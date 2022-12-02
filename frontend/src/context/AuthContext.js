import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import ServerAddress from '../ServerAddress'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

  let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
  let [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  let loginUser = async (e) => {
    e.preventDefault()
    let response = await fetch(`${ServerAddress}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
    })
    let data = await response.json() //token
    if(response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
      navigate('/')
    } else {
      alert('Something went wrong here!')
    }
  }

  let updateToken = async () => {
    console.log('Update token called');
    let response = await fetch(`${ServerAddress}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'refresh':authTokens?.refresh}) //refresh token
    })
    let data = await response.json() 

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
    } else {
      logoutUser()
    }
    if (loading) {
      setLoading(false)
    }
  }

  let logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    navigate('/login')
  }

  let contextData = {
    user:user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  }

  useEffect(() => {
    if (loading) {
      updateToken()
    }

    let fourMinutes = 1000 * 60 * 4
    let interval = setInterval(() => {
      if(authTokens) {
        updateToken()
      }
    }, fourMinutes)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData} >
      {loading ? null : children}
    </AuthContext.Provider>
  )
}