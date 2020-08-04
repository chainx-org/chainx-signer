import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export default function useFetchAssets(address, fetchFunc) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!address) {
      return
    }

    dispatch(fetchFunc(address))
    const intervalId = setInterval(() => {
      dispatch(fetchFunc(address))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [address, dispatch, fetchFunc])
}
