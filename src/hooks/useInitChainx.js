import { useEffect } from 'react'
import { setChainx, sleep } from '../shared'
import { paths } from '../constants'
import { setInitLoading } from '../store/reducers/statusSlice'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainxNodeSelector } from '../store/reducers/nodeSlice'
import { chainSelector } from '@store/reducers/chainSlice'
import { CHAINS } from '@store/reducers/constants'

export default function useInitChainx() {
  const history = useHistory()
  const { url: currentNodeUrl } = useSelector(currentChainxNodeSelector) || {}
  const dispatch = useDispatch()
  const chain = useSelector(chainSelector)

  useEffect(() => {
    if (CHAINS.chainx !== chain) {
      return
    }

    dispatch(setInitLoading(true))
    Promise.race([setChainx(currentNodeUrl), sleep(10000)])
      .then(chainx => {
        if (!chainx) {
          history.push(paths.nodeError)
        } else if (history.location.pathname === paths.nodeError) {
          history.push('/')
        }
      })
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`)
      })
      .finally(() => {
        dispatch(setInitLoading(false))
      })
  }, [chain, currentNodeUrl, dispatch, history])
}
