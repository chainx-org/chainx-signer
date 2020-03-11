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

function RemoveAccount(props) {
  const [errMsg, setErrMsg] = useState('')
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const currentAccount = useSelector(currentChainxAccountSelector)

  function _removeAccount(address, password, keystore) {
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      Account.fromKeyStore(keystore, password)
      dispatch(removeAccount({ address, chainId }))
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  const enter = function(pass) {
    if (!pass || !currentAccount) {
      return
    }

    const address = currentAccount.address
    const keystore = currentAccount.keystore
    _removeAccount(address, pass, keystore)
  }

  return <PasswordInput enter={enter} errMsg={errMsg} />
}

export default RemoveAccount
