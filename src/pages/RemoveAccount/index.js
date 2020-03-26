import React, { useState } from 'react'
import { Account } from 'chainx.js'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import {
  currentChainxAccountSelector,
  removeAccount
} from '../../store/reducers/accountSlice'
import PasswordInput from '../../components/PasswordInput'
import RemoveAccountConfirm from '../Drawers/RemoveAccountConfirm'

function RemoveAccount(props) {
  const [errMsg, setErrMsg] = useState('')
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const currentAccount = useSelector(currentChainxAccountSelector)
  const [showConfirm, setShowConfirm] = useState(false)

  function _removeAccount() {
    const address = currentAccount.address
    dispatch(removeAccount({ address, chainId }))
    props.history.push('/')
  }

  const enter = function(pass) {
    const keystore = currentAccount.keystore

    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      Account.fromKeyStore(keystore, pass)
      setShowConfirm(true)
    } catch (e) {
      setErrMsg('Invalid password')
    }
  }

  return (
    <>
      <PasswordInput
        enter={enter}
        errMsg={errMsg}
        onChange={() => setErrMsg('')}
      />

      <RemoveAccountConfirm
        text={'Sure to delete account?'}
        open={showConfirm}
        closeMenu={() => setShowConfirm(false)}
        ok={_removeAccount}
      />
    </>
  )
}

export default RemoveAccount
