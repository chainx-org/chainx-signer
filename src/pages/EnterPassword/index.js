import React from 'react'
import { useState } from 'react'
import { Account } from 'chainx.js'
import './enterPassword.scss'
import ErrorMessage from '../../components/ErrorMessage'
import { useSelector } from 'react-redux'
import { isTestNetSelector } from '../../store/reducers/settingSlice'

function EnterPassword(props) {
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const isTestNet = useSelector(isTestNetSelector)

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

  async function removeAccount(address, password, keystore) {
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      Account.fromKeyStore(keystore, password)
      // await removeChainxAccount(address, isTestNet);
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
        removeAccount(address, pass, keystore)
      }
    }
  }

  return (
    <div className="enter-password">
      <span className="title">Input password</span>
      <input
        className="input"
        type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
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
