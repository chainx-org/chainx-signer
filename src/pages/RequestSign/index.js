import React, { useEffect, useState } from 'react'
import { getSignRequest } from '../../shared'
import { parseData } from '../../shared/extensionExtrinsic'
import ErrorMessage from '../../components/ErrorMessage'
import './requestSign.scss'
import { DefaultButton, PrimaryButton, Slider, TextInput } from '@chainx/ui'
import { setLoading } from '../../store/reducers/statusSlice'
import { fetchTradePairs } from '../../store/reducers/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'
import Transfer from './Transfer'
import CommonTx from './CommonTx'
import Trade from './Trade'
import AssetsProcess from './AssetsProcess'
import Staking from './Staking'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import {
  clearToSign,
  isPseduClaimSelector,
  isStakingClaimSelector,
  toSignMethodNameSelector,
  toSignSelector
} from '../../store/reducers/txSlice'
import { service } from '../../services/socketService'
import { getGas } from '../../shared/signHelper'
import toPrecision from '../../shared/toPrecision'
import { xAssetsProcessCalls, stakingMethodNames } from './constants'
import PseduClaim from './PseduClaim'

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
  const currentAccount = useSelector(currentChainxAccountSelector)
  const toSign = useSelector(toSignSelector)

  const toSignMethodName = useSelector(toSignMethodNameSelector)
  const isStakingClaim = useSelector(isStakingClaimSelector)
  const isPseduClaim = useSelector(isPseduClaimSelector)

  const {
    location: { query }
  } = props

  useEffect(() => {
    parseQuery()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (toSign && toSign.data) {
      setCurrentGas(getGas(toSign.data, acceleration))
    }
  }, [acceleration, toSign])

  const check = () => {
    if (!pass) {
      setErrMsg('password is required')
      return false
    }
    return true
  }

  const fetchRelevantInfo = () => {
    if (newQuery.module === 'xSpot') {
      dispatch(fetchTradePairs())
    }
  }

  const parseQuery = () => {
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
          'convertToXrc20',
          'convertToAsset',
          'setTokenXrc20',
          'setXrc20Selector',
          'removeTokenXrc20',
          'forceIssueXrc20',
          'setGasPrice',
          'setPrintln'
        ]

        if (['putOrder', 'cancelOrder'].includes(method)) {
          module = 'xSpot'
        } else if (contractMethods.includes(method)) {
          module = 'xContracts'
        } else {
          module = ''
        }
        newQuery.module = module
        setNewQuery(newQuery)

        updateTxPanel()
        fetchRelevantInfo()
      } catch (error) {
        console.log('parse error ', error)
        props.history.push('/nodeError')
      }
    }
  }

  const updateTxPanel = () => {
    if (toSignMethodName === 'transfer') {
      return setTxPanel(<Transfer />)
    }

    if (xAssetsProcessCalls.includes(toSignMethodName)) {
      return setTxPanel(<AssetsProcess />)
    }

    if (stakingMethodNames.includes(toSignMethodName) || isStakingClaim) {
      return setTxPanel(<Staking query={newQuery} />)
    }

    if (isPseduClaim) {
      return setTxPanel(<PseduClaim />)
    }

    let _txPanel
    if (newQuery.module === 'xSpot') {
      _txPanel = <Trade query={newQuery} />
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
            <span className="yellow">{toPrecision(currentGas, 8)} PCX</span>
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
          showClear={false}
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
