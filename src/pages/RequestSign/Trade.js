import React from 'react'
import { useSelector } from 'react-redux'
import { pairsSelector } from '../../store/reducers/tradeSlice'
import toPrecision from '../../shared/toPrecision'
import { replaceBTC } from '../../shared/chainx'
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'
import { assetsInfoSelector } from '../../store/reducers/assetSlice'
import DetailItem from './components/DetailItem'
import DetailAmount from './components/DetailAmount'

export default function() {
  const pairs = useSelector(pairsSelector)
  const args = useSelector(toSignArgsSelector)
  const toSignMethodName = useSelector(toSignMethodNameSelector)

  const assetsInfo = useSelector(assetsInfoSelector)

  const [pairIndex] = args
  const pair = pairs[pairIndex]
  const { assets, currency, precision, unitPrecision } = pair || {}
  const { precision: assetsPrecision } =
    assetsInfo.find(info => info.name === assets) || {}

  const pairInfo = `${replaceBTC(assets)}/${replaceBTC(currency)}`

  return (
    <div className="detail">
      {toSignMethodName === 'putOrder' && (
        <>
          <DetailAmount
            value={`${args[2]} ${toPrecision(args[3], assetsPrecision)}`}
            token={assets}
          />
          <DetailItem
            label="Price"
            value={toPrecision(args[4], precision, precision - unitPrecision)}
          />
        </>
      )}
      {toSignMethodName === 'cancelOrder' && (
        <DetailItem label="Id" value={args[1]} />
      )}
      <DetailItem label="Trade pair" value={pairInfo} />
    </div>
  )
}
