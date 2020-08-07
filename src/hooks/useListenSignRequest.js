import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { paths } from '@constants'
import { networkSelector } from '@store/reducers/settingSlice'
import { CHAINX2_TEST } from '@store/reducers/constants'

export default function useListenSignRequest() {
  const toSign = useSelector(state => state.tx.toSign)
  const history = useHistory()
  const chainId = useSelector(networkSelector)

  useEffect(() => {
    try {
      if (toSign) {
        const pathname = [CHAINX2_TEST].includes(chainId)
          ? paths.chainx2Sign
          : paths.chainxSign
        history.push({ pathname })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    }
  }, [toSign, history, chainId])
}
