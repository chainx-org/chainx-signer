import useInitChainx2Instance from '../../hooks/useInitChainx2'
import useListenChainx2SignRequest from '../../hooks/useListenChainx2SignRequest'
import useFetchChainx2BasicInfo from '@hooks/useFetchChainx2BasicInfo'

export default function useInitChainx2() {
  useInitChainx2Instance()
  useListenChainx2SignRequest()
  useFetchChainx2BasicInfo()
}
