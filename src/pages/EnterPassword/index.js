import React from 'react'
import { useState } from 'react'
import { Account } from 'chainx.js'
import './enterPassword.scss'
import ErrorMessage from '../../components/ErrorMessage'
import { useSelector, useDispatch } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import { removeAccount } from '../../store/reducers/accountSlice'
import { TextInput } from '@chainx/ui'

function EnterPassword(props) {
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)

  async function exportPk(keystore, password) {
    try {
      const pk = Account.fromKeyStore(keystore, password).privateKey()
      props.history.push({
        pathname: '/showPrivateKey',
        query: { pk: pk }
      })
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  async function _removeAccount(address, password, keystore) {
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      Account.fromKeyStore(keystore, password)
      dispatch(removeAccount({ address, chainId }))
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  const enter = async function() {
    if (pass) {
      const address = props.location.query.address
      const keystore = props.location.query.keystore
      const type = props.location.query.type
      if (type === 'export') {
        exportPk(keystore, pass)
      } else if (type === 'remove') {
        _removeAccount(address, pass, keystore)
      }
    }
  }

  return (
    <div className="enter-password">
      <span className="title">Input password</span>
      <TextInput
        className="fixed-width"
        type="password"
        value={pass}
        onChange={setPass}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            enter()
          }
        }}
        placeholder="Password"
      />
      <button
        className="button button-yellow margin-top-40"
        onClick={() => enter()}
      >
        Confirm
      </button>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  )
}

export default EnterPassword
