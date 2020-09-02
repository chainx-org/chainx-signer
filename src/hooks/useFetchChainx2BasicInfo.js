import { useDispatch, useSelector } from 'react-redux'
import { networkSelector } from '@store/reducers/settingSlice'
import { getChainx2 } from '@shared/chainx2'
import { useEffect } from 'react'
import { CHAINX2_TEST } from '@store/reducers/constants'
import { fetchChainx2TradePairs } from '@store/reducers/chainx2DexSlice'

export default function useFetchChainx2BasicInfo() {
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)

  const chainx2 = getChainx2()

  useEffect(() => {
    if (![CHAINX2_TEST].includes(chainId)) {
      return
    }

    if (!chainx2) {
      return
    }

    dispatch(fetchChainx2TradePairs())
  }, [chainx2, chainId, dispatch])
}
