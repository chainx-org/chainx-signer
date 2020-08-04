import React, { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { useSelector } from 'react-redux'
import { default as downloadFile } from 'downloadjs'
import { useHistory } from 'react-router'
import { paths } from '../constants'
import { currentAccountSelector } from '@store/reducers/accountSlice'

export default function ExportKeystore() {
  const [errMsg, setErrMsg] = useState('')
  const currentAccount = useSelector(currentAccountSelector)
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
    downloadFile(JSON.stringify(keystore), address)
    history.push(paths.home)
  }

  return <PasswordInput enter={enter} errMsg={errMsg} />
}
