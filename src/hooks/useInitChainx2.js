import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { CHAINX2_TEST } from '@store/reducers/constants'
import { setInitLoading } from '@store/reducers/statusSlice'
import { sleep } from '@shared/chainx'
import { setChainx2 } from '@shared/chainx2'
import { paths } from '../constants'
import { useHistory } from 'react-router'
import { currentNodeSelector } from '@store/reducers/nodeSlice'
import { networkSelector } from '@store/reducers/settingSlice'

export default function useInitChainx2Instance() {
  const dispatch = useDispatch()
  const chain = useSelector(networkSelector)
  const { url: currentNodeUrl } = useSelector(currentNodeSelector)
  const history = useHistory()

  useEffect(() => {
    if (![CHAINX2_TEST].includes(chain)) {
      return
    }

    dispatch(setInitLoading(true))
    Promise.race([setChainx2(currentNodeUrl), sleep(10000)])
      .then(instance => {
        if (!instance) {
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
