import React, { useState } from 'react'
import './importAccount.scss'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'
import { PrimaryButton } from '@chainx/ui'
import { Account } from 'chainx.js'
import { ButtonLine, Container, SubTitle, Title } from '../../components/styled'

function ImportMnemonic(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [errMsg, setErrMsg] = useState('')
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''))

  const checkStep1 = () => {
    if (
      mnemonicList.some(item => (item || '').trim() === '') ||
      !Account.isMnemonicValid(
        mnemonicList.map(m => (m || '').trim()).join(' ')
      )
    ) {
      setErrMsg('Invalid mnemonic')
      return
    }

    setErrMsg('')
    setCurrentStep(s => s + 1)
  }

  if (currentStep === 1) {
    return (
      <NameAndPassword
        type={'mnemonic'}
        secret={mnemonicList.map(m => (m || '').trim()).join(' ')}
        onSuccess={function() {
          props.history.push('/')
        }}
      />
    )
  }

  return (
    <Container>
      <Title>Mnemonic</Title>
      <SubTitle>Input mnemonic words</SubTitle>
      <div className="import-mnemonic">
        {mnemonicList.map((item, index) => (
          <input
            className="word-item"
            key={index}
            value={mnemonicList[index]}
            onChange={e => {
              mnemonicList.splice(index, 1, e.target.value)
              setMnemonicList(Array.from(mnemonicList))
            }}
          />
        ))}
      </div>
      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={() => {
            checkStep1()
          }}
        >
          Next
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </Container>
  )
}

export default ImportMnemonic
