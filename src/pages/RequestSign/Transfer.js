import React from 'react'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { replaceBTC } from '../../shared/chainx'
import { useSelector } from 'react-redux'
import { toSignArgsSelector } from '../../store/reducers/txSlice'

export default function() {
  const [dest, token, balance, memo] = useSelector(toSignArgsSelector)

  return (
    <div className="detail">
      <div className="detail-amount">
        <span>Amount</span>
        <span>
          {toPrecision(balance, pcxPrecision)} {replaceBTC(token)}
        </span>
      </div>
      <div className="detail-item">
        <span>Dest</span>
        <span>{dest}</span>
      </div>
      <div className="detail-item">
        <span>Memo</span>
        <span>{memo}</span>
      </div>
    </div>
  )
}
