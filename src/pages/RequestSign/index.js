import React, { useEffect, useState } from 'react'
import { getCurrentGas, getSignRequest } from '../../shared'
import { parseData } from '../../shared/extensionExtrinsic'
import ErrorMessage from '../../components/ErrorMessage'
import './requestSign.scss'
import { DefaultButton, PrimaryButton, Slider, TextInput } from '@chainx/ui'
import { setLoading } from '../../store/reducers/statusSlice'
import { fetchIntentions } from '../../store/reducers/intentionSlice'
import { fetchFee, fetchTradePairs } from '../../store/reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import Transfer from './Transfer'
import CommonTx from './CommonTx'
import Trade from './Trade'
import AssetsProcess from './AssetsProcess'
import Staking from './Staking'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import { isTestNetSelector } from '../../store/reducers/settingSlice'
import { clearToSign } from '../../store/reducers/txSlice'
import { service } from '../../services/socketService'

function RequestSign(props) {
  const dispatch = useDispatch()
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [currentGas, setCurrentGas] = useState(0)
  const [acceleration, setAcceleration] = useState(1)
  const [txPanel, setTxPanel] = useState(null)
  const [newQuery, setNewQuery] = useState(
    Object.assign({}, props.location.query)
  )
  const isTestNet = useSelector(isTestNetSelector)
  const currentAccount = useSelector(currentChainxAccountSelector)

  const {
    location: { query }
  } = props

  useEffect(() => {
    parseQuery(isTestNet)
    // eslint-disable-next-line
  }, [isTestNet])

  const check = () => {
    if (!pass) {
      setErrMsg('password is required')
      return false
    }
    return true
  }

  const fetchRelevantInfo = isTestNet => {
    if (newQuery.module === 'xStaking') {
      dispatch(fetchIntentions(isTestNet))
    }
    if (newQuery.module === 'xSpot') {
      dispatch(fetchTradePairs(isTestNet))
    }
    if (newQuery.module === 'xAssetsProcess') {
      dispatch(fetchFee(isTestNet))
    }
  }

  const parseQuery = isTestNet => {
    if (!query) {
      return
    }
    if (!query.module) {
      try {
        const [method, args, argsWithName] = parseData(query.data)
        newQuery.method = method
        newQuery.argsWithName = argsWithName
        newQuery.args = args
        let module = ''
        const contractMethods = [
          'putCode',
          'call',
          'instantiate',
          'claimSurcharge',
          'convertToErc20',
          'convertToAsset',
          'setTokenErc20',
          'setErc20Selector',
          'removeTokenErc20',
          'forceIssueErc20',
          'setGasPrice',
          'setPrintln'
        ]
        if (
          [
            'nominate',
            'renominate',
            'unnominate',
            'unfreeze',
            'claim',
            'register'
          ].includes(method)
        ) {
          module = 'xStaking'
          if (args.length === 1 && args[0].length < 6) {
            module = 'xTokens'
          }
        } else if (['withdraw', 'revokeWithdraw'].includes(method)) {
          module = 'xAssetsProcess'
        } else if (['putOrder', 'cancelOrder'].includes(method)) {
          module = 'xSpot'
        } else if (['transfer'].includes(method)) {
          module = 'xAssets'
        } else if (contractMethods.includes(method)) {
          module = 'xContracts'
        } else {
          module = ''
        }
        newQuery.module = module
        setNewQuery(newQuery)

        updateTxPanel()
        getCurrentGas(currentAccount, newQuery, setErrMsg, setCurrentGas)
        fetchRelevantInfo(isTestNet)
      } catch (error) {
        console.log('parse error ', error)
        props.history.push('/nodeError')
      }
    }
  }

  const updateTxPanel = () => {
    let _txPanel
    if (newQuery.module === 'xAssets' && newQuery.method === 'transfer') {
      _txPanel = <Transfer query={newQuery} />
    } else if (newQuery.module === 'xSpot') {
      _txPanel = <Trade query={newQuery} />
    } else if (newQuery.module === 'xAssetsProcess') {
      _txPanel = <AssetsProcess query={newQuery} />
    } else if (['xStaking', 'xTokens'].includes(newQuery.module)) {
      _txPanel = <Staking query={newQuery} />
    } else {
      _txPanel = <CommonTx query={newQuery} />
    }
    setTxPanel(_txPanel)
  }

  const sign = async () => {
    setErrMsg('')
    if (!currentAccount || !currentAccount.address) {
      setErrMsg(`Error: address is not exist`)
      return
    }
    if (!check()) {
      return
    }
    if (currentAccount.address !== query.address) {
      setErrMsg('Invalid address')
      return
    }

    dispatch(setLoading(true))
    try {
      await getSignRequest(pass, acceleration)
      setErrMsg('')
      dispatch(setLoading(false))
      removeCurrentSign()
      props.history.push('/')
    } catch (e) {
      dispatch(setLoading(false))
      setErrMsg(`Error: ${e.message}`)
    }
  }

  window.onbeforeunload = function() {
    removeCurrentSign()
  }

  const cancel = () => {
    removeCurrentSign()

    // 通知dapp拒绝签名
    const { origin, id, dataId } = query
    service.emit(origin, id, 'api', {
      id: dataId,
      result: { reject: true }
    })
  }

  const removeCurrentSign = () => {
    try {
      dispatch(clearToSign())
    } catch (e) {
      console.log(e)
      // window.close()
    } finally {
      props.history.push('/')
    }
  }

  const getCurrentGasText = () => {
    return (acceleration * currentGas) / 10 ** 8 + ' PCX'
  }

  // xStaking
  // 投票，切换投票，赎回，解冻，提息
  // nominate, renominate, unnominate, unfreeze, claim
  // 切换投票页面不一样
  // this.api.tx.xStaking.nominate(target, value, memo);
  // this.api.tx.xStaking.renominate(from, to, value, memo);
  // this.api.tx.xStaking.unnominate(target, value, memo);
  // this.api.tx.xStaking.unfreeze(target, revocationIndex);
  // this.api.tx.xStaking.claim(target);

  // xAssetsProcess(Asset.js)
  // 提现，取消提现
  // withdraw, revokeWithdraw
  // this.api.tx.xAssetsProcess.withdraw(token, value, addr, ext);
  // this.api.tx.xAssetsProcess.revokeWithdraw(id);

  // xSpot(Trade.js)
  // 挂单，撤单
  // putOrder, cancelOrder
  // this.api.tx.xSpot.putOrder(pairid, ordertype, direction, amount, price);
  // this.api.tx.xSpot.cancelOrder(pairid, index);

  const marks = [
    {
      value: 1,
      label: '1x'
    },
    {
      value: 10,
      label: '10x'
    }
  ]

  if (!query) {
    return <></>
  }

  return (
    <div className="container request-sign">
      <div className="tx-panel">{txPanel}</div>
      <div className="adjust-gas">
        <div className="adjust-gas-desc">
          <div>
            <span>Fee</span>
            <span className="yellow">{getCurrentGasText()}</span>
          </div>
          <span>More fee, faster speed</span>
        </div>
        <Slider
          defaultValue={acceleration}
          onChange={v => setAcceleration(v)}
          // getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={10}
        />
      </div>
      <div className="submit-area">
        <div className="title">
          <span>Input password</span>
        </div>
        <TextInput
          value={pass}
          onChange={setPass}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              sign()
            }
          }}
          className="fixed-width"
          type="password"
          placeholder="Password"
        />
        <ErrorMessage msg={errMsg} />
        <div className="button-area margin-top-40">
          <DefaultButton size="large" onClick={cancel}>
            Cancel
          </DefaultButton>
          <PrimaryButton size="large" onClick={() => sign()}>
            Sign
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default RequestSign
