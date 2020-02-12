import React from 'react'
import { useSelector } from 'react-redux'
import { pairsSelector } from '../../store/reducers/tradeSlice'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { replaceBTC } from '../../shared/chainx'
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'

export default function() {
  const pairs = useSelector(pairsSelector)
  const args = useSelector(toSignArgsSelector)
  const toSignMethodName = useSelector(toSignMethodNameSelector)

  const getPrecision = (id, type) => {
    if (id === 0 && type === 'amount') {
      return [pcxPrecision, pcxPrecision]
    }
    if (id === 0 && type === 'price') {
      return [9, 7]
    }
    if (id === 1 && type === 'amount') {
      return [3, 3]
    }
    if (id === 1 && type === 'price') {
      return [4, 8]
    } else {
      return [pcxPrecision, pcxPrecision]
    }
  }

  return (
    <div className="detail">
      {toSignMethodName === 'putOrder' && (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {args[2]}{' '}
              {toPrecision(args[3], ...getPrecision(args[0], 'amount'))}{' '}
              {pairs[args[0]] && pairs[args[0]].assets}
            </span>
          </div>
          <div className="detail-item">
            <span>Price</span>
            <span>
              {toPrecision(args[4], ...getPrecision(args[0], 'price'))}
            </span>
          </div>
        </>
      )}
      {toSignMethodName === 'cancelOrder' && (
        <div className="detail-item">
          <span>Id</span>
          <span>{args[1]}</span>
        </div>
      )}
      <div className="detail-item">
        <span>Trade pair</span>
        <span>
          {pairs[args[0]] &&
            replaceBTC(pairs[args[0]].assets) +
              '/' +
              replaceBTC(pairs[args[0]].currency)}
        </span>
      </div>
    </div>
  )
}
