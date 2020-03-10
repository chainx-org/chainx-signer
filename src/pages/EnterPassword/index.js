import React, { useState } from 'react'
import { Account } from 'chainx.js'
import './enterPassword.scss'
import ErrorMessage from '../../components/ErrorMessage'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import { removeAccount } from '../../store/reducers/accountSlice'
import { PasswordInput } from '@chainx/ui'
import { ButtonLine, InputWrapper, Title } from '../../components/styled'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'

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
      <Title>Input password</Title>
      <InputWrapper>
        <PasswordInput
          className="fixed-width"
          value={pass}
          onChange={setPass}
          style={{ width: '100%' }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              enter()
            }
          }}
          placeholder="Password"
        />
      </InputWrapper>
      <ButtonLine>
        <PrimaryButton size="large" onClick={() => enter()}>
          Confirm
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  )
}

export default EnterPassword
