import { useHistory } from 'react-router'
import { Container, InputWrapper, Title } from '../../components/styled'
import React, { useState } from 'react'
import { PasswordInput, PrimaryButton, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { importedKeystoreSelector } from '../../store/reducers/statusSlice'
import { isKeystoreV1 } from '../../utils'
import ButtonLine from '../RequestSign/components/ButtonLine'
import ErrorMessage from '../../components/ErrorMessage'
import { isTestNetSelector } from '../../store/reducers/settingSlice'
import KeyStore from '@chainx/keystore'
import { addAccount } from '../../store/reducers/accountSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import { Account } from 'chainx.js'

export default function ImportKeystore() {
  const history = useHistory()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const dispatch = useDispatch()
  const isTestNet = useSelector(isTestNetSelector)
  const keystore = useSelector(importedKeystoreSelector)
  const isV1 = do {
    if (keystore) {
      isKeystoreV1(keystore)
    }
  }

  const encoded = isV1 ? keystore.encoded : keystore

  const checkAndImport = () => {
    let account
    try {
      Account.setNet(isTestNet ? 'testnet' : 'mainnet')
      account = Account.from(KeyStore.decrypt(encoded, password))
    } catch (e) {
      setErrMsg('Invalid password or keystore')
      return
    }

    dispatch(
      addAccount({
        chainId: isTestNet ? CHAINX_TEST : CHAINX_MAIN,
        account: {
          name: isV1 ? keystore.tag : name,
          address: account.address(),
          keystore: encoded
        }
      })
    )

    history.push('/')
  }

  return (
    <Container>
      <Title>Import from keystore</Title>

      <InputWrapper>
        {!isV1 && (
          <TextInput
            showClear={false}
            style={{ width: '100%' }}
            type="text"
            value={name}
            onChange={value => setName(value)}
            placeholder="Name(12 characters max)"
          />
        )}
        <PasswordInput
          style={{ width: '100%', marginTop: 12 }}
          value={password}
          onChange={value => setPassword(value)}
          placeholder="Password"
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
