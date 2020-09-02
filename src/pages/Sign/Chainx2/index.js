/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Wrapper } from '@pages/Sign/Chainx2/styledComponents'
import { TxDetail } from '@pages/Sign/components'
import NativeTokenTransfer from '@pages/Sign/Chainx2/NativeTokenTransfer'
import { DefaultButton, PasswordInput, PrimaryButton } from '@chainx/ui'
import ButtonLine from '@pages/Sign/components/ButtonLine'
import { service } from '../../../services/socketService'
import { chainx2ToSignSelector } from '@store/reducers/txSlice'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { removeCurrentSign } from '@pages/Sign/Chainx2/utils'
import ErrorMessage from '../../../components/ErrorMessage'
import { currentAccountSelector } from '@store/reducers/accountSlice'
import KeyStore from '@chainx/keystore'
import { signExtrinsic } from '@pages/Sign/Chainx2/sign'
import VoteUnVote from '@pages/Sign/Chainx2/VoteUnVote'
import CommonTx from '@pages/Sign/Chainx2/CommonTx'
import CancelOrder from '@pages/Sign/Chainx2/CancelOrder'
import UnlockUnbonded from '@pages/Sign/Chainx2/UnlockUnbonded'

export default function Chainx2Sign() {
  const inputWrapperRef = useRef(null)
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const toSign = useSelector(chainx2ToSignSelector)
  const currentAccount = useSelector(currentAccountSelector)

  useEffect(() => {
    if (inputWrapperRef.current) {
      inputWrapperRef.current.querySelector('input').focus()
    }
  }, [inputWrapperRef])

  const check = () => {
    if (!currentAccount || !currentAccount.address) {
      setErrMsg(`Error: address is not exist`)
      return false
    }

    if (!pass) {
      setErrMsg('password is required')
      return false
    }

    try {
      KeyStore.decrypt(currentAccount.keystore, pass)
    } catch (e) {
      setErrMsg('Invalid password')
      return false
    }
    return true
  }

  const sign = async () => {
    setErrMsg('')
    if (!check()) {
      return
    }

    try {
      await signExtrinsic(pass)
      removeCurrentSign(dispatch, history)
    } catch (e) {
      setErrMsg(`Error: ${e.message}`)
    }
  }

  const cancel = () => {
    removeCurrentSign(dispatch, history)

    // 通知dapp拒绝签名
    const { origin, id, dataId } = toSign
    service.emit(origin, id, 'api', {
      id: dataId,
      result: { reject: true }
    })
  }

  if (!toSign || !toSign.data) {
    return <></>
  }

  return (
    <Wrapper>
      <TxDetail>
        {do {
          const { data: { section, method } = {} } = toSign
          if (method === 'transfer') {
            ;<NativeTokenTransfer />
          } else if (
            section === 'xStaking' &&
            ['bond', 'unbond'].includes(method)
          ) {
            ;<VoteUnVote />
          } else if (
            section === 'xStaking' &&
            method === 'unlock_unbonded_withdrawal'
          ) {
            ;<UnlockUnbonded />
          } else if (section === 'xSpot' && method === 'cancelOrder') {
            ;<CancelOrder />
          } else {
            ;<CommonTx />
          }
        }}
      </TxDetail>

      <div ref={inputWrapperRef}>
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
