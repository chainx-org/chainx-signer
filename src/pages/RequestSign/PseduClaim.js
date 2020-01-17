import { useSelector } from 'react-redux'
import { toSignArgsSelector } from '../../store/reducers/txSlice'
import { replaceBTC } from '../../shared/chainx'
import DetailItem from './components/DetailItem'
import React from 'react'

export default function() {
  const args = useSelector(toSignArgsSelector)

  return (
    <div className="detail">
      <DetailItem label="Token" value={replaceBTC(args[0])} />
    </div>
  )
}
