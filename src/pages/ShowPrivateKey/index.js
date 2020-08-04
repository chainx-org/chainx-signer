import React, { useState } from 'react'
import StaticWarning from '../../components/StaticWarning'
import styled from 'styled-components'
import { Container, Title } from '../../components/styled'
import { useSelector } from 'react-redux'
import { currentAccountSelector } from '../../store/reducers/accountSlice'
import PasswordInput from '../../components/PasswordInput'
import KeyStore from '@chainx/keystore'

const StyledContainer = styled(Container)`
  .pk {
    margin: 24px -20px 0;
    padding: 10px 0;
    background-color: #f6c94a;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 245px;
    }
  }
`

const KeyWrapper = styled.span`
  font-size: 14px;
  color: #000000;
  text-align: center;
  line-height: 20px;
  opacity: 0.87;

  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
`

function ShowPrivateKey() {
  const [privateKey, setPrivateKey] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const account = useSelector(currentAccountSelector)

  const { keystore: keyStore } = account || {}

  function exportPrivateKey(pass) {
    if (!keyStore) {
      return
    }

    try {
      const pk = KeyStore.decrypt(keyStore, pass)
      setPrivateKey(pk)
    } catch (e) {
      setErrMsg(e.message)
    }
  }

  return !privateKey ? (
    <PasswordInput enter={exportPrivateKey} errMsg={errMsg} />
  ) : (
    <StyledContainer>
      <Title>Private Key</Title>
      <StaticWarning desc="Do not store your private key in your PC or network. Anybody with your private key will take your asseets." />
      <div className="pk">
        <KeyWrapper>{privateKey}</KeyWrapper>
      </div>
    </StyledContainer>
  )
}

export default ShowPrivateKey
