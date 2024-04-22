import React, { createContext, useContext, useEffect, useState } from 'react'

import { getCurrentUser } from '../lib/appwrite'

const GlobalContext = createContext({
  isLogged: false,
  setIsLogged: (value: boolean) => {},
  user: null,
  setUser: (value: any) => {},
  loading: true,
})
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true)
          setUser(res)
        } else {
          setIsLogged(false)
          setUser(null)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
