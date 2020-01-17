import React from 'react'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { replaceBTC } from '../../shared/chainx'
import { useSelector } from 'react-redux'
import { toSignArgsSelector } from '../../store/reducers/txSlice'
import DetailAmount from './components/DetailAmount'
import DetailItem from './components/DetailItem'

export default function() {
  const [dest, token, balance, memo] = useSelector(toSignArgsSelector)

  return (
    <div className="detail">
      <DetailAmount
        token={replaceBTC(token)}
        value={toPrecision(balance, pcxPrecision)}
      />
      <DetailItem label="Dest" value={dest} />
      <DetailItem label="Memo" value={memo} />
    </div>
  )
}
