import { useEffect } from 'react'
import { setChainx, sleep } from '../shared'
import { paths } from '../constants'
import { setInitLoading } from '../store/reducers/statusSlice'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainxNodeSelector } from '../store/reducers/nodeSlice'

export default function useInitChainx() {
  const history = useHistory()
  const { url: currentNodeUrl } = useSelector(currentChainxNodeSelector) || {}
  const dispatch = useDispatch()

  useEffect(() => {
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
  }, [currentNodeUrl, dispatch, history])
}
