import React, { useCallback, useEffect, useState } from 'react'
import { getGas, signAndSend } from '../../shared/signHelper'
import ErrorMessage from '../../components/ErrorMessage'
import { DefaultButton, PasswordInput, PrimaryButton } from '@chainx/ui'
import {
  setLoading,
  setShowAccountMenu,
  setShowNodeMenu
} from '../../store/reducers/statusSlice'
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
import {
  stakingMethodNames,
  tradeMethodNames,
  xAssetsProcessCalls
} from './constants'
import PseduClaim from './PseduClaim'
import { getChainx } from '../../shared/chainx'
import ButtonLine from './components/ButtonLine'
import { TxDetail } from './components'
import Fee from './Fee'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
`

function RequestSign(props) {
  const dispatch = useDispatch()
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [currentGas, setCurrentGas] = useState(0)
  const [acceleration, setAcceleration] = useState(1)
  const [txPanel, setTxPanel] = useState(null)
  const currentAccount = useSelector(currentChainxAccountSelector)
  const toSign = useSelector(toSignSelector)
  if (process.env.NODE_ENV === 'development') {
    console.log('toSign', toSign)
  }

  const toSignMethodName = useSelector(toSignMethodNameSelector)
  const isStakingClaim = useSelector(isStakingClaimSelector)
  const isPseduClaim = useSelector(isPseduClaimSelector)

  useEffect(() => {
    dispatch(setShowAccountMenu(false))
    dispatch(setShowNodeMenu(false))
  }, [dispatch])

  useEffect(() => {
    if (toSign && toSign.data) {
      try {
        setCurrentGas(getGas(toSign.data, acceleration))
      } catch (e) {
        setErrMsg('Failed to get transaction fee')
      }
    }
  }, [acceleration, toSign])

  const check = () => {
    if (!pass) {
      setErrMsg('password is required')
      return false
    }

    const chainx = getChainx()
    try {
      chainx.account.fromKeyStore(currentAccount.keystore, pass)
    } catch (e) {
      setErrMsg('Invalid password')
      return false
    }
    return true
  }

  const updatePanel = useCallback(() => {
    if (tradeMethodNames.includes(toSignMethodName)) {
      dispatch(fetchTradePairs())
    }

    setTxPanel(
      do {
        if (toSignMethodName === 'transfer') {
          // eslint-disable-next-line no-unused-expressions
          ;<Transfer />
        } else if (xAssetsProcessCalls.includes(toSignMethodName)) {
          // eslint-disable-next-line no-unused-expressions
          ;<AssetsProcess />
        } else if (
          stakingMethodNames.includes(toSignMethodName) ||
          isStakingClaim
        ) {
          // eslint-disable-next-line no-unused-expressions
          ;<Staking />
        } else if (isPseduClaim) {
          // eslint-disable-next-line no-unused-expressions
          ;<PseduClaim />
        } else if (tradeMethodNames.includes(toSignMethodName)) {
          // eslint-disable-next-line no-unused-expressions
          ;<Trade />
        } else {
          // eslint-disable-next-line no-unused-expressions
          ;<CommonTx />
        }
      }
    )
  }, [toSignMethodName, dispatch, isPseduClaim, isStakingClaim])

  useEffect(() => {
    if (toSign && toSign.data) {
      updatePanel()
    }
  }, [toSign, updatePanel])

  const sign = async () => {
    setErrMsg('')
    if (!currentAccount || !currentAccount.address) {
      setErrMsg(`Error: address is not exist`)
      return
    }
    if (!check()) {
      return
    }
    if (currentAccount.address !== toSign.address) {
      setErrMsg('Invalid address')
      return
    }

    dispatch(setLoading(true))
    try {
      await signAndSend(pass, acceleration)
      setErrMsg('')
      dispatch(setLoading(false))
      removeCurrentSign()
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
    const { origin, id, dataId } = toSign
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

  if (!toSign) {
    return <></>
  }

  return (
    <Wrapper>
      <TxDetail>{txPanel}</TxDetail>
      <Fee
        currentGas={currentGas}
        acceleration={acceleration}
        setAcceleration={setAcceleration}
      />
      <div>
        <PasswordInput
          value={pass}
          onChange={value => {
            setErrMsg('')
            setPass(value)
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              sign()
            }
          }}
          className="full-width"
          placeholder="Password"
          style={{ marginTop: 16 }}
        />
        <ErrorMessage msg={errMsg} />
        <ButtonLine>
          <DefaultButton size="large" onClick={cancel}>
            Cancel
          </DefaultButton>
          <PrimaryButton
            disabled={!!errMsg}
            size="large"
            onClick={() => sign()}
          >
            Sign
          </PrimaryButton>
        </ButtonLine>
      </div>
    </Wrapper>
  )
}

export default RequestSign
