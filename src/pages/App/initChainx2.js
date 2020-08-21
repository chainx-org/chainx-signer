import useInitChainx2Instance from '../../hooks/useInitChainx2'
import useListenChainx2SignRequest from '../../hooks/useListenChainx2SignRequest'

export default function useInitChainx2() {
  useInitChainx2Instance()
  useListenChainx2SignRequest()
}
