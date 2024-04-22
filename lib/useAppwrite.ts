import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

const useAppwrite = (fn: () => Promise<any>) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fn()
      setData(res)
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return { data, loading, refetch }
}

export default useAppwrite
