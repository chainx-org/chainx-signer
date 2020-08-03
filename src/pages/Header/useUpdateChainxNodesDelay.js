import { useEffect } from 'react'
import updateChainxNodesDelay from '@shared/updateNodeStatus'

export default function() {
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
