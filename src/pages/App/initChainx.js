import useListenSignRequest from '../../hooks/useListenSignRequest'
import useCheckVersion from '../../hooks/useCheckVersion'
import useInitChainx from '../../hooks/useInitChainx'
import useFetchBasicInfo from '../../hooks/useFetchBasicInfo'
import useFetchChainxAssets from '../../hooks/useFetchChainxAssets'

export default function() {
  useListenSignRequest()
  useCheckVersion()
  useInitChainx()
  useFetchBasicInfo()
  useFetchChainxAssets()
}
