import { useEffect } from 'react'
import { fetchAccountAssets } from '../store/reducers/assetSlice'
import { useDispatch, useSelector } from 'react-redux'
import { currentAddressSelector } from '../store/reducers/accountSlice'

export default function useFetchChainxAssets() {
  const dispatch = useDispatch()
  const address = useSelector(currentAddressSelector)

  useEffect(() => {
    if (address) {
      dispatch(fetchAccountAssets(address))
    }
  }, [dispatch, address])
}
