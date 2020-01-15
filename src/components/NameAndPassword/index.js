import React, { useState } from 'react'
import { Account } from 'chainx.js'
import ErrorMessage from '../ErrorMessage'
import WarningMessage from '../WarningMessage'
import { useSelector, useDispatch } from 'react-redux'
import { isTestNetSelector } from '../../store/reducers/settingSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import {
  addAccount,
  chainxAccountsSelector
} from '../../store/reducers/accountSlice'
import { TextInput } from '@chainx/ui'

function NameAndPassword(props) {
  const { secret, onSuccess } = props
  const [obj, setObj] = useState({ name: '', pass: '', repass: '' })
  const [errMsg, setErrMsg] = useState('')
  const accounts = useSelector(chainxAccountsSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()

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
    if ((accounts || []).find(a => a.name === obj.name)) {
      setErrMsg('name already exist')
      return false
    }
    return true
  }

  const create = async () => {
    if (!check()) {
      return
    }

    const keystore = account.encrypt(obj.pass)

    dispatch(
      addAccount({
        chainId: isTestNet ? CHAINX_TEST : CHAINX_MAIN,
        account: { name: obj.name, address: account.address(), keystore }
      })
    )
    onSuccess()
  }

  const inputList = [
    { name: 'name', type: 'text', placeholder: 'Name(12 characters max)' },
    { name: 'pass', type: 'password', placeholder: 'Password' },
    { name: 'repass', type: 'password', placeholder: 'Password confirmation' }
  ]

  return (
    <div className="flex-column">
      {inputList.map((item, i) => (
        <TextInput
          key={i}
          className="fixed-width"
          type={item.type}
          value={obj[item.name]}
          onChange={value => setObj({ ...obj, [item.name]: value })}
          placeholder={item.placeholder}
          onKeyPress={event => {
            if (event.key === 'Enter' && i === 2) {
              create()
            }
          }}
        />
      ))}
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
    </div>
  )
}

export default NameAndPassword
