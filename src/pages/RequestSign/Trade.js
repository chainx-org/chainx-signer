import React from 'react'
import { useSelector } from 'react-redux'
import { pairsSelector } from '../../store/reducers/tradeSlice'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { replaceBTC } from '../../shared/chainx'

export default function(props) {
  const { query } = props
  const pairs = useSelector(pairsSelector)

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
      {query.method === 'putOrder' && (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {query.args[2]}{' '}
              {toPrecision(
                query.args[3],
                ...getPrecision(query.args[0], 'amount')
              )}{' '}
              {pairs[query.args[0]] && pairs[query.args[0]].assets}
            </span>
          </div>
          <div className="detail-item">
            <span>Price</span>
            <span>
              {toPrecision(
                query.args[4],
                ...getPrecision(query.args[0], 'price')
              )}
            </span>
          </div>
        </>
      )}
      {query.method === 'cancelOrder' && (
        <div className="detail-item">
          <span>Id</span>
          <span>{query.args[1]}</span>
        </div>
      )}
      <div className="detail-item">
        <span>Trade pair</span>
        <span>
          {pairs[query.args[0]] &&
            replaceBTC(pairs[query.args[0]].assets) +
              '/' +
              replaceBTC(pairs[query.args[0]].currency)}
        </span>
      </div>
    </div>
  )
}
