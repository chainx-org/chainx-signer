import React, { useState } from 'react'
import { Account } from 'chainx.js'
import ErrorMessage from '../ErrorMessage'
import WarningMessage from '../WarningMessage'
import { createAccount } from '../../messaging'
import { useRedux } from '../../shared'

function NameAndPassword(props) {
  const { secret, onSuccess } = props
  const [obj, setObj] = useState({ name: '', pass: '', repass: '' })
  const [errMsg, setErrMsg] = useState('')
  const [{ accounts }] = useRedux('accounts')
  const [{ isTestNet }] = useRedux('isTestNet')
  Account.setNet(isTestNet ? 'testnet' : 'mainnet')
  const account = Account.from(secret)
  const address = account.address()
  const sameAccount = (accounts || []).find(
    account => account.address === address
  )

  const check = () => {
    if (!obj.name || !obj.pass || !obj.repass) {
      setErrMsg('name and password are required')
      return false
    }
    if (obj.pass.length < 8) {
      setErrMsg('password length must great than 8')
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(obj.pass)) {
      setErrMsg('password must include lower and upper characters')
      return false
    }
    if (obj.pass !== obj.repass) {
      setErrMsg('password is not match')
      return false
    }
    return true
  }

  const create = async () => {
    if (!check()) {
      return
    }

    const keystore = account.encrypt(obj.pass)

    createAccount(obj.name, account.address(), keystore, isTestNet)
      .then(_ => {
        onSuccess()
      })
      .catch(err => {
        setErrMsg(err.message)
      })
  }

  return (
    <>
      <input
        className="input"
        type="text"
        required
        value={obj.name}
        onChange={e => setObj({ ...obj, name: e.target.value })}
        placeholder="Name(12 characters max)"
      />
      <input
        className="input"
        type="password"
        value={obj.pass}
        onChange={e => setObj({ ...obj, pass: e.target.value })}
        placeholder="Password"
      />
      <input
        className="input"
        type="password"
        value={obj.repass}
        onChange={e => setObj({ ...obj, repass: e.target.value })}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            create()
          }
        }}
        placeholder="Password confirmation"
      />
      <button
        className="button button-yellow margin-top-40"
        onClick={() => {
          create()
        }}
      >
        OK
      </button>
      {errMsg && <ErrorMessage msg={errMsg} />}
      {sameAccount && (
        <WarningMessage
          msg={`Account ${sameAccount.name} has same address, and it will be overwritten by this account.`}
        />
      )}
    </>
  )
}

export default NameAndPassword
