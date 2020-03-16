import React, { useState } from 'react'
import './importAccount.scss'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'
import { PrimaryButton, TextInput } from '@chainx/ui'
import { Account } from 'chainx.js'
import { ButtonLine, Container, SubTitle } from '../../components/styled'

function ImportAccount(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [pk, setPk] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''))

  const subTitleList = ['Input mnemonic words', 'Input private key']
  const isMnemonic = 0 === currentTabIndex

  const checkStep1 = () => {
    if (currentTabIndex === 0) {
      if (
        mnemonicList.some(item => (item || '').trim() === '') ||
        !Account.isMnemonicValid(
          mnemonicList.map(m => (m || '').trim()).join(' ')
        )
      ) {
        setErrMsg('Invalid mnemonic')
        return
      }
    } else if (currentTabIndex === 1) {
      if (!pk) {
        setErrMsg('Private key is not correct')
        return
      }
    }

    setErrMsg('')
    setCurrentStep(s => s + 1)
  }

  if (currentStep === 1) {
    return (
      <NameAndPassword
        type={currentTabIndex === 0 ? 'mnemonic' : 'pk'}
        secret={
          currentTabIndex === 0
            ? mnemonicList.map(m => (m || '').trim()).join(' ')
            : pk.trim()
        }
        onSuccess={function() {
          props.history.push('/')
        }}
      />
    )
  }

  return (
    <Container>
      <div className="import-account-title">
        <div className="import-account-title-select">
          <span>{isMnemonic ? 'Mnemonic' : 'Private key'}</span>
          <span
            className="second-choice"
            onClick={() => {
              setErrMsg('')
              setCurrentTabIndex(1 - currentTabIndex)
            }}
          >
            {isMnemonic ? 'Private key' : 'Mnemonic'}
          </span>
        </div>
        <SubTitle>{subTitleList[currentTabIndex]}</SubTitle>
      </div>
      {isMnemonic ? (
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
      ) : (
        <TextInput
          value={pk}
          onChange={value => setPk(value)}
          multiline={true}
          rows={4}
          style={{ flex: 'unset' }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              checkStep1()
            }
          }}
        />
      )}
      <ButtonLine>
        <PrimaryButton
          style={{ minWidth: 200 }}
          size="large"
          onClick={() => {
            if (currentStep < 1) {
              checkStep1()
            }
          }}
        >
          Next
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </Container>
  )
}

export default ImportAccount
