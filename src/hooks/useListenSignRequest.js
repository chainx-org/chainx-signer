import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { paths } from '@constants'

export default function useListenSignRequest() {
  const toSign = useSelector(state => state.tx.toSign)
  const history = useHistory()

  useEffect(() => {
    try {
      if (toSign) {
        history.push({
          pathname: paths.chianxSign
        })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    }
  }, [toSign, history])
}
