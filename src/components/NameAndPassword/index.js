import React, { useEffect, useState } from 'react'
import { Account } from 'chainx.js'
import { Account as V2Account } from '@chainx-v2/account'
import ErrorMessage from '../ErrorMessage'
import WarningMessage from '../WarningMessage'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import {
  CHAINX2_TEST,
  CHAINX_MAIN,
  CHAINX_TEST
} from '../../store/reducers/constants'
import {
  accountsSelector,
  addAccount,
  chainxAccountsSelector
} from '../../store/reducers/accountSlice'
import { PasswordInput, PrimaryButton, TextInput } from '@chainx/ui'
import ButtonLine from '../../pages/RequestSign/components/ButtonLine'
import { Container, SubTitle, Title } from '../styled'
import KeyStore from '@chainx/keystore'
import { chainx2TestNetAccountsSelector } from '@store/reducers/accountSlice'

function NameAndPassword({ secret, onSuccess }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const accounts = useSelector(chainxAccountsSelector)
  const chainx2Accounts = useSelector(chainx2TestNetAccountsSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const [sameAccount, setSameAccount] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    if ([CHAINX_TEST, CHAINX_MAIN].includes(chainId)) {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      const account = Account.from(secret)
      setAccount(account)
      const address = account.address()
      const sameAccount = (accounts || []).find(
        account => account.address === address
      )
      setSameAccount(sameAccount || null)
    } else if ([CHAINX2_TEST].includes(chainId)) {
      const account = V2Account.from(secret)
      setAccount(account)
      const address = account.address()
      const sameAccount = (chainx2Accounts || []).find(
        a => a.address === address
      )
      setSameAccount(sameAccount || null)
    } else {
      throw new Error('Unknown chain')
    }
  }, [chainId, accounts, chainx2Accounts, isTestNet, secret])

  const targetAccounts = useSelector(accountsSelector)

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
    if ((targetAccounts || []).find(a => a.name === name)) {
      setErrMsg('name already exist')
      return false
    }
    return true
  }

  const create = () => {
    if (!check()) {
      return
    }

    const keystore = KeyStore.encrypt(account.privateKey(), password)
    dispatch(
      addAccount({
        chainId,
        account: { name: name, address: account.address(), keystore }
      })
    )

    onSuccess()
  }

  return (
    <Container style={{ flex: 'unset' }}>
      <Title>Name and password setting</Title>
      <SubTitle>
        Password contains at least 8 characters, and at least one upper,lower
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
    </Container>
  )
}

export default NameAndPassword
