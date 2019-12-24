import React from 'react'
import { useState } from 'react'
import { Account } from 'chainx.js'
import shuffle from 'lodash.shuffle'
import './createAccount.scss'
import StaticWarning from '../../components/StaticWarning'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'

function CreateAccount(props: any) {
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
  const mnemonicWords = mnemonicList.map((item: string, index: number) => ({
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
            mnemonicWords.map((item: any) => (
              <div className="word-item" key={item.index}>
                {item.value}
              </div>
            ))}
          {currentStep === 2 &&
            shuffleMnemonicList.map((item: any, index: number) => (
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
        {currentStep < 2 && (
          <button
            className="button button-yellow margin-top-40"
            onClick={() => {
              if (currentStep < 2) {
                setCurrentStep(s => s + 1)
              }
            }}
          >
            {buttonTextList[currentStep]}
          </button>
        )}
        {currentStep === 2 && (
          <div className="container-spacebetween margin-top-40">
            <button
              className="button button-white-half"
              onClick={() => clearErrMsg() && setCurrentStep(s => s - 1)}
            >
              Pre
            </button>
            <button
              className="button button-yellow-half"
              onClick={() => checkMnemonic() && setCurrentStep(s => s + 1)}
            >
              Next
            </button>
          </div>
        )}
        {currentStep > 1 ? errMsg ? <ErrorMessage msg={errMsg} /> : null : null}
      </div>
      {currentStep === 2 && (
        <div className="validate-mnemonic-area">
          <div className="validate-mnemonic-area-container">
            {validateMnemonicList.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateAccount
