import { useEffect } from 'react'
import { fetchIntentions } from '../store/reducers/intentionSlice'
import { fetchAssetsInfo } from '../store/reducers/assetSlice'
import { fetchTradePairs } from '../store/reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { isTestNetSelector } from '../store/reducers/settingSlice'

export default function useFetchBasicInfo() {
  const dispatch = useDispatch()
  const isTestNet = useSelector(isTestNetSelector)

  useEffect(() => {
    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
    dispatch(fetchTradePairs())
  }, [isTestNet, dispatch])
}
