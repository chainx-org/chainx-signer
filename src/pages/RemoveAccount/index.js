import React, { useState } from 'react'
import { Account } from 'chainx.js'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import { removeAccount } from '../../store/reducers/accountSlice'
import PasswordInput from '../../components/PasswordInput'
import Confirm from '../Drawers/Confirm'
import KeyStore from '@chainx/keystore'
import { CHAINX_MAIN, CHAINX_TEST } from '@store/reducers/constants'
import { currentAccountSelector } from '@store/reducers/accountSlice'

function RemoveAccount(props) {
  const [errMsg, setErrMsg] = useState('')
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const [showConfirm, setShowConfirm] = useState(false)
  const currentAccount = useSelector(currentAccountSelector)

  function _removeAccount() {
    const address = currentAccount.address
    dispatch(removeAccount({ address, chainId }))
    props.history.push('/')
  }

  const enter = function(pass) {
    const keystore = currentAccount.keystore
    if ([CHAINX_MAIN, CHAINX_TEST].includes(chainId)) {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
    }

    try {
      KeyStore.decrypt(keystore, pass)
    } catch (e) {
      setErrMsg('Invalid password')
    }

    setShowConfirm(true)
  }

  return (
    <>
      <PasswordInput
        enter={enter}
        errMsg={errMsg}
        onChange={() => setErrMsg('')}
      />

      <Confirm
        text={'Sure to delete account?'}
        open={showConfirm}
        closeMenu={() => setShowConfirm(false)}
        ok={_removeAccount}
      />
    </>
  )
}

export default RemoveAccount
