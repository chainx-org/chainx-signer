import { useEffect } from 'react'
import getDelay from '@shared/updateNodeStatus'

export default function() {
  useEffect(() => {
    getDelay()
      .then(() => console.log('Delay info updated'))
      .catch(() => console.log('Failed to update delay info'))

    const intervalId = setInterval(() => {
      getDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'))
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])
}
