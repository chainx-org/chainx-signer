import { useEffect } from 'react'
import updateChainx2NodesDelay from '@shared/updateChainx2NodeStatus'
import { useSelector } from 'react-redux'
import { CHAINX2_TEST } from '@store/reducers/constants'
import { networkSelector } from '@store/reducers/settingSlice'

export default function() {
  const chain = useSelector(networkSelector)
  if (chain !== CHAINX2_TEST) {
    return
  }

  useEffect(() => {
    updateChainx2NodesDelay()
      .then(() => console.log('Chainx2 delay info updated'))
      .catch(() => console.log('Failed to update Chainx2 delay info'))

    const intervalId = setInterval(() => {
      updateChainx2NodesDelay()
        .then(() => console.log('Chainx2 Delay info updated'))
        .catch(() => console.log('Failed to update Chainx2 delay info'))
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])
}
