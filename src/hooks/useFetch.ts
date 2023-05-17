import { useState, useEffect } from 'react'
import {message} from 'antd'
type FetchError = Error | undefined

interface RequestOptionsType {
  headers?: { [key: string]: string }
}

const useFetch = (
  url: string,
  options: RequestOptionsType = {},
): { response: any; error: FetchError; isLoading: boolean } => {
  const [response, setResponse] = useState(undefined)
  const [error, setError] = useState<FetchError>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const res = await fetch(url, {
          headers: {
            ...options.headers, // 传递已有header信息
            'Content-Type': 'application/json', // 增加请求头
          },
        })
        if (!res.ok) {
          const errMessage = `An error has occurred: ${res.status}`
          message.error(errMessage)
          console.error(errMessage)
          throw new Error(errMessage)
        } else {
          const resContent = await res.json()          
          setResponse(resContent)
        }
      } catch (err) {
        console.log(err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [url])
  return { response, error, isLoading }
}

export default useFetch
