import React from 'react'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { useSelector } from 'react-redux'
import { feeSelector } from '../../store/reducers/tradeSlice'

export default function(props) {
  const { query } = props
  const fee = useSelector(feeSelector)

  return (
    <div className="detail">
      {query.method === 'withdraw' && (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {toPrecision(query.args[1], pcxPrecision)} {query.args[0]}
            </span>
          </div>
          <div className="detail-item">
            <span>Fee</span>
            <span>
              {toPrecision(fee, pcxPrecision)} {query.args[0]}
            </span>
          </div>
          <div className="detail-item">
            <span>Dest</span>
            <span>{query.args[2]}</span>
          </div>
          <div className="detail-item">
            <span>Memo</span>
            <span>{query.args[3]}</span>
          </div>
        </>
      )}
      {query.method === 'revokeWithdraw' && (
        <div className="detail-item">
          <span>Id</span>
          <span>{query.args[0]}</span>
        </div>
      )}
    </div>
  )
}
