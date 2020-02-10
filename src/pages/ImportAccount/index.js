import React, { useState } from 'react'
import './importAccount.scss'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'
import { TextInput } from '@chainx/ui'
import { Account } from 'chainx.js'

function ImportAccount(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [pk, setPk] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [mnemonicList, setMnemonicList] = useState(new Array(12).fill(''))

  const titleList = [
    ['Mnemonic', 'Private key'],
    ['Password', 'Password']
  ]
  const subTitleList = [
    ['Input mnemonic words', 'Input private key'],
    ['', '']
  ]

  const checkStep1 = () => {
    if (currentTabIndex === 0) {
      if (
        mnemonicList.some(item => item === '') ||
        !Account.isMnemonicValid(mnemonicList.join(' '))
      ) {
        setErrMsg('Mnemonic is not correct')
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

  return (
    <div className="container import-account">
      <div className="import-account-title">
        <div className="import-account-title-select">
          <span>{titleList[currentStep][currentTabIndex]}</span>
          {currentStep === 0 ? (
            <span
              className="second-choice"
              onClick={() => {
                setErrMsg('')
                setCurrentTabIndex(1 - currentTabIndex)
              }}
            >
              {titleList[currentStep][1 - currentTabIndex]}
            </span>
          ) : null}
        </div>
        <span className="import-account-sub-title">
          {subTitleList[currentStep][currentTabIndex]}
        </span>
      </div>
      <div className="import-account-body">
        <div className="import-account-body-content">
          {currentStep === 0 ? (
            currentTabIndex === 0 ? (
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
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    checkStep1()
                  }
                }}
              />
            )
          ) : null}
          {currentStep === 1 && (
            <NameAndPassword
              type={currentTabIndex === 0 ? 'mnemonic' : 'pk'}
              secret={
                currentTabIndex === 0 ? mnemonicList.join(' ') : pk.trim()
              }
              onSuccess={function() {
                props.history.push('/')
              }}
            />
          )}
        </div>
        {currentStep === 0 && (
          <button
            className="button button-yellow margin-top-40"
            onClick={() => {
              if (currentStep < 1) {
                checkStep1()
              }
            }}
          >
            Next
          </button>
        )}
        {errMsg ? <ErrorMessage msg={errMsg} /> : null}
      </div>
    </div>
  )
}

export default ImportAccount
