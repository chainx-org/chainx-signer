import React from 'react'
import { useState } from 'react'
import { Account } from 'chainx.js'
import shuffle from 'lodash.shuffle'
import './createAccount.scss'
import StaticWarning from '../../components/StaticWarning'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'
import { PrimaryButton } from '@chainx/ui'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`

function CreateAccount(props) {
  const titleList = [
    'New Account',
    'Backup Mnemonic',
    'Verify Mnemonic',
    'Name and password setting'
  ]
  const subTitleList = [
    '',
    'Write down following mnemonic words, and will be used next step.',
    'Mark the words one by one in the order last step shows.',
    'Password contains at lease 8 characters, and at least one upper,lower and number case character.'
  ]
  const buttonTextList = ['Begin', 'Next', 'Next', 'OK']

  const [currentStep, setCurrentStep] = useState(0)
  const [errMsg, setErrMsg] = useState('')
  const [mnemonic] = useState(Account.newMnemonic())
  const mnemonicList = mnemonic.split(' ')
  const [wordSelectedList, setWordSelectedList] = useState(
    new Array(mnemonicList.length).fill(false)
  )
  const [shuffleMnemonicList] = useState(shuffle(mnemonicList))
  const [validateMnemonicList, setValidateMnemonicList] = useState(
    new Array(12).fill('')
  )
  const mnemonicWords = mnemonicList.map((item, index) => ({
    value: item,
    index: index
  }))

  const clearErrMsg = () => {
    setErrMsg('')
    return true
  }

  const checkMnemonic = () => {
    if (mnemonic === validateMnemonicList.join(' ')) {
      clearErrMsg()
      return true
    }
    setErrMsg('Mnemonic not correct')
    return false
  }

  return (
    <div className="container create-account">
      <div className="create-account-title">
        <span>{titleList[currentStep]}</span>
        <span className="create-account-sub-title">
          {subTitleList[currentStep]}
        </span>
      </div>
      <div className="create-account-body">
        <div className="create-account-body-content">
          {currentStep === 0 && <StaticWarning title="Backup Mnemonic" />}
          {currentStep === 1 &&
            mnemonicWords.map(item => (
              <div className="word-item" key={item.index}>
                {item.value}
              </div>
            ))}
          {currentStep === 2 &&
            shuffleMnemonicList.map((item, index) => (
              <div
                className={
                  'word-item word-item-click ' +
                  (wordSelectedList[index] ? 'word-item-selected' : '')
                }
                key={index}
                onClick={() => {
                  const wordSelected = wordSelectedList[index]
                  let wordIndex = validateMnemonicList.indexOf('')
                  let replaceWord = item
                  if (wordSelected) {
                    // word has selected, remove last word
                    wordIndex =
                      11 -
                      Array.from(validateMnemonicList)
                        .reverse()
                        .indexOf(item)
                    replaceWord = ''
                  }
                  validateMnemonicList.splice(wordIndex, 1, replaceWord)
                  setValidateMnemonicList(Array.from(validateMnemonicList))
                  wordSelectedList.splice(index, 1, !wordSelected)
                  setWordSelectedList(Array.from(wordSelectedList))
                }}
              >
                {item}
              </div>
            ))}
          {currentStep === 3 && (
            <NameAndPassword
              type="mnemonic"
              secret={mnemonic}
              onSuccess={function() {
                props.history.push('/')
              }}
            />
          )}
        </div>
        <Wrapper>
          {currentStep < 2 && (
            <PrimaryButton
              style={{ minWidth: 200 }}
              size="large"
              onClick={() => setCurrentStep(s => s + 1)}
            >
              {buttonTextList[currentStep]}
            </PrimaryButton>
          )}
          {currentStep === 2 && (
            <>
              <PrimaryButton
                size="large"
                onClick={() => clearErrMsg() && setCurrentStep(s => s - 1)}
              >
                Pre
              </PrimaryButton>
              <PrimaryButton
                size="large"
                onClick={() => checkMnemonic() && setCurrentStep(s => s + 1)}
              >
                Next
              </PrimaryButton>
            </>
          )}
        </Wrapper>
        {currentStep > 1 ? <ErrorMessage msg={errMsg} /> : null}
      </div>
      {currentStep === 2 && (
        <p className="validate-mnemonic-area">
          {validateMnemonicList.map(
            (item, index) => item && <span key={index}>{item}</span>
          )}
        </p>
      )}
    </div>
  )
}

export default CreateAccount
