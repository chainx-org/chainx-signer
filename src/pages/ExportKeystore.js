import React, { useState, useEffect } from 'react'
import PasswordInput from '../components/PasswordInput'
import { useSelector } from 'react-redux'
import {
  currentChainxAccountSelector,
  chainxAccountsSelector
} from '../store/reducers/accountSlice'
import { importedKeystoreSelector } from '../store/reducers/statusSlice'
import { default as downloadFile } from 'downloadjs'
import { useHistory } from 'react-router'
import KeyStore from '@chainx/keystore'
import FileSaver from 'file-saver'
import { paths } from '../constants'
import Account from '@chainx/account'
import { isKeystoreV1, KeyStoreV2Encrypt } from '../utils'

export default function ExportKeystore() {
  const [errMsg, setErrMsg] = useState('')
  const currentAccount = useSelector(currentChainxAccountSelector)
  const accounts = useSelector(chainxAccountsSelector)
  const history = useHistory()
  const [name, setName] = useState('')

  const keystore = useSelector(importedKeystoreSelector)
  const [encoded, setEncoded] = useState(null)

  useEffect(() => {
    if (keystore) {
      const isV1 = isKeystoreV1(keystore)

      setEncoded(isV1 ? keystore.encoded : keystore)
      if (isV1) {
        setName(keystore.tag)
      }
    }
  }, [keystore])

  const enter = function(pass) {
    if (!pass) {
      setErrMsg('Invalid password')
      return
    }
    console.log(JSON.stringify(accounts))

    if (!currentAccount) {
      return setErrMsg('No account')
    }

    const { address, keystore } = currentAccount

    try {
      const result = KeyStore.decrypt(keystore, pass)

      console.log('正常解析.....' + JSON.stringify(result))

      const json = KeyStoreV2Encrypt(Account.from(result).privateKey(), pass)

      console.log(json)

      FileSaver.saveAs(json, address)

      history.push(paths.home)
    } catch (err) {
      setErrMsg('Invalid password')

      console.log('解析出错...' + JSON.stringify(err))
      history.push(paths.home)
    }
  }

  return <PasswordInput enter={enter} errMsg={errMsg} />
}
