import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchIntentions,
  intentionAccountNameMapSelector
} from '../../store/reducers/intentionSlice'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { getChainx, replaceBTC } from '../../shared/chainx'
import {
  toSignArgsSelector,
  toSignMethodNameSelector
} from '../../store/reducers/txSlice'
import { nominateMethodNames } from './constants'
import DetailItem from './components/DetailItem'
import DetailAmount from './components/DetailAmount'

export default function(props) {
  const { query } = props
  const intentionAccountNameMap = useSelector(intentionAccountNameMapSelector)
  const chainx = getChainx()
  const dispatch = useDispatch()

  const methodName = useSelector(toSignMethodNameSelector)
  const isNominateMethod = nominateMethodNames.includes(methodName)
  const args = useSelector(toSignArgsSelector)

  useEffect(() => {
    dispatch(fetchIntentions())
  }, [dispatch])

  const getPublicKey = address => {
    return chainx.account.decodeAddress(address)
  }

  return (
    <div className="detail">
      {isNominateMethod ? (
        <>
          <DetailAmount
            value={toPrecision(args.slice(-2, -1), pcxPrecision)}
            token="PCX"
          />
          {methodName === 'renominate' && (
            <DetailItem
              label="From node"
              value={intentionAccountNameMap[getPublicKey(args[0])]}
            />
          )}
          <DetailItem
            label="Dest node"
            value={intentionAccountNameMap[getPublicKey(args.slice(-3, -2)[0])]}
          />
          <DetailItem label="Memo" value={args.slice(-1)} />
        </>
      ) : (
        <>
          {query.module === 'xTokens' && (
            <DetailItem label="Token" value={replaceBTC(args[0])} />
          )}
          {methodName === 'register' ? (
            <DetailItem label="Name" value={query.args[0]} />
          ) : (
            <>
              {query.module === 'xStaking' && (
                <DetailItem
                  label="Node"
                  value={intentionAccountNameMap[getPublicKey(query.args[0])]}
                />
              )}
              {methodName === 'unfreeze' && (
                <DetailItem label="Id" value={query.args[1]} />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
