import useListenSignRequest from '../../hooks/useListenSignRequest'
import useInitChainx from '../../hooks/useInitChainx'
import useFetchBasicInfo from '../../hooks/useFetchBasicInfo'
import useFetchChainxAssets from '../../hooks/useFetchChainxAssets'

export default function() {
  useListenSignRequest()
  useInitChainx()
  useFetchBasicInfo()
  useFetchChainxAssets()
}
