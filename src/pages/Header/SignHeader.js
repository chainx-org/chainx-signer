import React from 'react'
import { toSignExtrinsicSelector } from '../../store/reducers/txSlice'
import { useSelector } from 'react-redux'

export default function() {
  const extrinsic = useSelector(toSignExtrinsicSelector)
  const methodName = extrinsic && extrinsic.methodName

  return (
    <div className="center-title">
      <span>
        {(methodName || '').replace(/([A-Z])/g, ' $1').toLowerCase() ||
          'Sign Request'}
      </span>
    </div>
  )
}
