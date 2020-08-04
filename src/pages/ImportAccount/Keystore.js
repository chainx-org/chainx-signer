import { useHistory } from 'react-router'
import {
  ButtonLine,
  Container,
  InputWrapper,
  Title
} from '../../components/styled'
import React, { useEffect, useState } from 'react'
import { PasswordInput, PrimaryButton, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { importedKeystoreSelector } from '../../store/reducers/statusSlice'
import { isKeystoreV1 } from '../../utils'
import ErrorMessage from '../../components/ErrorMessage'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import KeyStore from '@chainx/keystore'
import { addAccount } from '../../store/reducers/accountSlice'
import {
  CHAINX2_TEST,
  CHAINX_MAIN,
  CHAINX_TEST
} from '../../store/reducers/constants'
import { Account } from 'chainx.js'
import { Account as V2Account } from '@chainx-v2/account'

export default function ImportKeystore() {
  const history = useHistory()
  const [name, setName] = useState('')
  const [keystorePass, setKeystorePass] = useState('')
  const [accountPass, setAccountPass] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const dispatch = useDispatch()
  const isTestNet = useSelector(isTestNetSelector)
  const keystore = useSelector(importedKeystoreSelector)
  const [encoded, setEncoded] = useState(null)
  const chainId = useSelector(networkSelector)

  useEffect(() => {
    if (keystore) {
      const isV1 = isKeystoreV1(keystore)

      setEncoded(isV1 ? keystore.encoded : keystore)
      if (isV1) {
        setName(keystore.tag)
      }
    }
  }, [keystore])

  const checkAndImport = () => {
    if (!name || !accountPass || !confirmation) {
      setErrMsg('Name and password are required')
      return false
    }
    if (accountPass !== confirmation) {
      setErrMsg('password is not match')
      return false
    }
    if (accountPass.length < 8) {
      setErrMsg('password length must great than 8')
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(accountPass)) {
      setErrMsg('password must include lower and upper characters')
      return false
    }

    let privateKey
    try {
      privateKey = KeyStore.decrypt(encoded, keystorePass)
    } catch (e) {
      setErrMsg('Invalid password or keystore')
      return
    }

    let account, keystore
    if ([CHAINX_TEST, CHAINX_MAIN].includes(chainId)) {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      account = Account.from(privateKey)
      keystore = account.encrypt(accountPass)
    } else if ([CHAINX2_TEST].includes(chainId)) {
      account = V2Account.from(privateKey)
      keystore = KeyStore.encrypt(privateKey, accountPass)
    }

    dispatch(
      addAccount({
        chainId,
        account: { name, address: account.address(), keystore }
      })
    )

    history.push('/')
  }

  return (
    <Container>
      <Title>Import from keystore</Title>

      <InputWrapper>
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
          value={keystorePass}
          onChange={value => setKeystorePass(value)}
          placeholder="Keystore Password"
        />

        <PasswordInput
          style={{ width: '100%', marginTop: 12 }}
          value={accountPass}
          onChange={value => setAccountPass(value)}
          placeholder="Account Password"
        />
        <PasswordInput
          style={{ width: '100%', marginTop: 12 }}
          value={confirmation}
          onChange={value => setConfirmation(value)}
          placeholder="Account password confirmation"
          onKeyPress={event => {
            if (event.key === 'Enter') {
              checkAndImport()
            }
          }}
        />
      </InputWrapper>

      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={checkAndImport}
        >
          OK
        </PrimaryButton>
      </ButtonLine>
      {errMsg && <ErrorMessage msg={errMsg} />}
    </Container>
  )
}
