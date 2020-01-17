import React, { useEffect } from 'react'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { useDispatch, useSelector } from 'react-redux'
import { feeSelector, fetchFee } from '../../store/reducers/tradeSlice'
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'

export default function() {
  const fee = useSelector(feeSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFee())
  }, [dispatch])

  const methodName = useSelector(toSignMethodNameSelector)
  const args = useSelector(toSignArgsSelector)

  return (
    <div className="detail">
      {methodName === 'withdraw' && (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {toPrecision(args[1], pcxPrecision)} {args[0]}
            </span>
          </div>
          <div className="detail-item">
            <span>Fee</span>
            <span>
              {toPrecision(fee, pcxPrecision)} {args[0]}
            </span>
          </div>
          <div className="detail-item">
            <span>Dest</span>
            <span>{args[2]}</span>
          </div>
          <div className="detail-item">
            <span>Memo</span>
            <span>{args[3]}</span>
          </div>
        </>
      )}
      {methodName === 'revokeWithdraw' && (
        <div className="detail-item">
          <span>Id</span>
          <span>{args[0]}</span>
        </div>
      )}
    </div>
  )
}
