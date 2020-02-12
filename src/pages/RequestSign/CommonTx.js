import React from 'react'
import DetailItem from './components/DetailItem'
import { useSelector } from 'react-redux'
import {
  toSignExtrinsicSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'

export default function() {
  const toSignMethodName = useSelector(toSignMethodNameSelector)
  const methodName = toSignMethodName.replace(/([A-Z])/g, '_$1').toLowerCase()
  const extrinsic = useSelector(toSignExtrinsicSelector)

  return (
    <div className="detail">
      <DetailItem label="Method" value={methodName} />
      <div className="detail-item">
        <span>Args</span>
        <section className="args">
          <ol>
            {(extrinsic.argsArr || []).map((arg, index) => {
              if (!arg) {
                return null
              }

              return (
                <li key={index}>
                  <span className="arg-name">{arg.name}: </span>
                  <span className="arg-value">
                    {arg.value.toString().length > 10000
                      ? '[object Object]'
                      : arg.value.toString()}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}
