import React, { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { useSelector } from 'react-redux'
import {
  currentChainxAccountSelector,
  chainxAccountsSelector
} from '../store/reducers/accountSlice'

import { useHistory } from 'react-router'
import KeyStore from '@chainx/keystore'
import FileSaver from 'file-saver'
import { paths } from '../constants'
import Account from '@chainx/account'
import { KeyStoreV2Encrypt } from '../utils'

export default function ExportKeystore() {
  const [errMsg, setErrMsg] = useState('')
  const currentAccount = useSelector(currentChainxAccountSelector)
  const history = useHistory()

  const enter = function(pass) {
    if (!pass) {
      setErrMsg('Invalid password')
      return
    }

    if (!currentAccount) {
      return setErrMsg('No account')
    }

    const { address, keystore } = currentAccount

    try {
      const result = KeyStore.decrypt(keystore, pass)
      const json = KeyStoreV2Encrypt(Account.from(result).privateKey(), pass)
      FileSaver.saveAs(json, address)

      history.push(paths.home)
    } catch (err) {
      setErrMsg('Invalid password')

      history.push(paths.home)
    }
  }

  return <PasswordInput enter={enter} errMsg={errMsg} />
}
