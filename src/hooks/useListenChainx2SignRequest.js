import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { paths } from '@constants'
import { chainx2ToSignSelector } from '@store/reducers/txSlice'

export default function useListenChainx2SignRequest() {
  const chainx2ToSign = useSelector(chainx2ToSignSelector)
  const history = useHistory()
  const { pathname } = useLocation()

  useEffect(() => {
    try {
      if (chainx2ToSign) {
        history.push({ pathname: paths.chainx2Sign })
      } else if (pathname === paths.chainx2Sign) {
        history.push({ pathname: paths.home })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    }
  }, [history, chainx2ToSign, pathname])
}
