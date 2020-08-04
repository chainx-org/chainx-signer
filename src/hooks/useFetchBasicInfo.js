import { useEffect } from 'react'
import { fetchIntentions } from '../store/reducers/intentionSlice'
import { fetchAssetsInfo } from '../store/reducers/assetSlice'
import { fetchTradePairs } from '../store/reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { networkSelector } from '../store/reducers/settingSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '@store/reducers/constants'
import { getChainx } from '@shared/chainx'

export default function useFetchBasicInfo() {
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const chainx = getChainx()

  useEffect(() => {
    if (![CHAINX_TEST, CHAINX_MAIN].includes(chainId)) {
      return
    }

    if (!chainx) {
      return
    }

    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
    dispatch(fetchTradePairs())
  }, [chainx, chainId, dispatch])
}
