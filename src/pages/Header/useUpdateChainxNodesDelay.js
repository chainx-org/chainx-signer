import { useEffect } from 'react'
import updateChainxNodesDelay from '@shared/updateNodeStatus'
import { useSelector } from 'react-redux'
import { CHAINX_MAIN, CHAINX_TEST } from '@store/reducers/constants'
import { networkSelector } from '@store/reducers/settingSlice'

export default function() {
  const chainId = useSelector(networkSelector)
  if (![CHAINX_TEST, CHAINX_MAIN].includes(chainId)) {
    return
  }

  useEffect(() => {
    updateChainxNodesDelay()
      .then(() => console.log('Delay info updated'))
      .catch(() => console.log('Failed to update delay info'))

    const intervalId = setInterval(() => {
      updateChainxNodesDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'))
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])
}
