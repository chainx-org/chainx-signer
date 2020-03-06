import React, { useEffect } from 'react'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { useDispatch, useSelector } from 'react-redux'
import { feeSelector, fetchFee } from '../../store/reducers/tradeSlice'
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'
import DetailItem from './components/DetailItem'
import DetailAmount from './components/DetailAmount'

export default function() {
  const fee = useSelector(feeSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFee())
  }, [dispatch])

  const methodName = useSelector(toSignMethodNameSelector)
  const args = useSelector(toSignArgsSelector)

  return (
    <>
      {methodName === 'withdraw' && (
        <>
          <DetailAmount
            value={toPrecision(args[1], pcxPrecision)}
            token={args[0]}
          />
          <DetailItem
            label="Fee"
            value={`${toPrecision(fee, pcxPrecision)} ${args[0]}`}
          />
          <DetailItem label="Dest" value={args[2]} />
          <DetailItem label="Memo" value={args[3]} />
        </>
      )}
      {methodName === 'revokeWithdraw' && (
        <DetailItem label="Id" value={args[0]} />
      )}
    </>
  )
}
