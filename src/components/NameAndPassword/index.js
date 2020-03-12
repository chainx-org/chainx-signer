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
import { TextInput, PasswordInput, PrimaryButton } from '@chainx/ui'
import ButtonLine from '../../pages/RequestSign/components/ButtonLine'
import styled from 'styled-components'
import { SubTitle, Title } from '../styled'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`

function NameAndPassword({ secret, onSuccess }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
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
    if (!name || !password || !confirmation) {
      setErrMsg('name and password are required')
      return false
    }
    if (password.length < 8) {
      setErrMsg('password length must great than 8')
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setErrMsg('password must include lower and upper characters')
      return false
    }
    if (password !== confirmation) {
      setErrMsg('password is not match')
      return false
    }
    if ((accounts || []).find(a => a.name === name)) {
      setErrMsg('name already exist')
      return false
    }
    return true
  }

  const create = () => {
    if (!check()) {
      return
    }

    const keystore = account.encrypt(password)

    dispatch(
      addAccount({
        chainId: isTestNet ? CHAINX_TEST : CHAINX_MAIN,
        account: { name: name, address: account.address(), keystore }
      })
    )
    onSuccess()
  }

  return (
    <Wrapper>
      <Title>Name and password setting</Title>
      <SubTitle>
        Password contains at lease 8 characters, and at least one upper,lower
        and number case character.
      </SubTitle>
      <TextInput
        showClear={false}
        style={{ width: '100%' }}
        type="text"
        value={name}
        onChange={value => setName(value)}
        placeholder="Name(12 characters max)"
      />
      <PasswordInput
        style={{ width: '100%', marginTop: 12 }}
        value={password}
        onChange={value => setPassword(value)}
        placeholder="Password"
      />
      <PasswordInput
        style={{ width: '100%', marginTop: 12 }}
        value={confirmation}
        onChange={value => setConfirmation(value)}
        placeholder="Password confirmation"
        onKeyPress={event => {
          if (event.key === 'Enter') {
            create()
          }
        }}
      />

      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={() => {
            create()
          }}
        >
          OK
        </PrimaryButton>
      </ButtonLine>
      {errMsg && <ErrorMessage msg={errMsg} />}
      {sameAccount && (
        <WarningMessage
          msg={`Account ${sameAccount.name} has same address, and it will be overwritten by this account.`}
        />
      )}
    </Wrapper>
  )
}

export default NameAndPassword
