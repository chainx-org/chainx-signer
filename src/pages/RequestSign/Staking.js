import React from 'react'
import { useSelector } from 'react-redux'
import { intentionAccountNameMapSelector } from '../../store/reducers/intentionSlice'
import toPrecision from '../../shared/toPrecision'
import { pcxPrecision } from '../../shared/constants'
import { getChainx, replaceBTC } from '../../shared/chainx'

export default function(props) {
  const { query } = props
  const intentionAccountNameMap = useSelector(intentionAccountNameMapSelector)
  const chainx = getChainx()

  const getPublicKey = address => {
    return chainx.account.decodeAddress(address)
  }

  return (
    <div className="detail">
      {query.args.length > 2 ? (
        <>
          <div className="detail-amount">
            <span>Amount</span>
            <span>
              {toPrecision(query.args.slice(-2, -1), pcxPrecision)} PCX
            </span>
          </div>
          {query.method === 'renominate' && (
            <div className="detail-item">
              <span>From node</span>
              <span>
                {intentionAccountNameMap[getPublicKey(query.args[0])]}
              </span>
            </div>
          )}
          <div className="detail-item">
            <span>Dest node</span>
            <span>
              {
                intentionAccountNameMap[
                  getPublicKey(query.args.slice(-3, -2)[0])
                ]
              }
            </span>
          </div>
          <div className="detail-item">
            <span>Memo</span>
            <span>{query.args.slice(-1)}</span>
          </div>
        </>
      ) : (
        <>
          {query.module === 'xTokens' && (
            <div className="detail-item">
              <span>Token</span>
              <span>{replaceBTC(query.args[0])}</span>
            </div>
          )}
          {query.method === 'register' ? (
            <div className="detail-item">
              <span>Name</span>
              <span>{query.args[0]}</span>
            </div>
          ) : (
            <>
              {query.module === 'xStaking' && (
                <div className="detail-item">
                  <span>Node</span>
                  <span>
                    {intentionAccountNameMap[getPublicKey(query.args[0])]}
                  </span>
                </div>
              )}
              {query.method === 'unfreeze' && (
                <div className="detail-item">
                  <span>Id</span>
                  <span>{query.args[1]}</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
