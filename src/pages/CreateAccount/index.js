import React, { useState } from 'react'
import { Account } from 'chainx.js'
import shuffle from 'lodash.shuffle'
import './createAccount.scss'
import StaticWarning from '../../components/StaticWarning'
import ErrorMessage from '../../components/ErrorMessage'
import NameAndPassword from '../../components/NameAndPassword'
import { PrimaryButton } from '@chainx/ui'
import styled from 'styled-components'
import { Container, SubTitle, Title } from '../../components/styled'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`

const MnemonicWordsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const WordItem = styled.div`
  margin-top: 16px;
  width: 30%;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 20px;
  color: #3f3f3f;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ValidatedWrapper = styled.p`
  margin: 20px -20px 0;
  background-color: #f2f3f4;
  flex: 1;
  justify-content: center;
  padding: 8px 20px 0;
  flex-wrap: wrap;
  min-height: 60px;

  span {
    display: inline-block;

    &:not(:last-of-type) {
      margin-right: 10px;
    }

    word-break: break-all;
    margin-top: 8px;
    height: 15px;
    font-size: 14px;
    color: #3f3f3f;
  }
`

function CreateAccount(props) {
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

  const nextButton = (
    <Wrapper>
      <PrimaryButton
        style={{ minWidth: 200 }}
        size="large"
        onClick={() => setCurrentStep(s => s + 1)}
      >
        {buttonTextList[currentStep]}
      </PrimaryButton>
    </Wrapper>
  )

  if (0 === currentStep) {
    return (
      <Container>
        <Title>New Account</Title>
        <StaticWarning title="Backup Mnemonic" />
        {nextButton}
      </Container>
    )
  }

  if (1 === currentStep) {
    return (
      <Container>
        <Title>Backup Mnemonic</Title>
        <SubTitle>
          Write down following mnemonic words, and will be used next step.
        </SubTitle>
        <MnemonicWordsWrapper>
          {mnemonicWords.map(item => (
            <WordItem key={item.index}>{item.value}</WordItem>
          ))}
        </MnemonicWordsWrapper>
        {nextButton}
      </Container>
    )
  }

  if (3 === currentStep) {
    return (
      <NameAndPassword
        type="mnemonic"
        secret={mnemonic}
        onSuccess={function() {
          props.history.push('/')
        }}
      />
    )
  }

  return (
    <Container>
      <Title>Verify Mnemonic</Title>
      <SubTitle>
        Mark the words one by one in the order last step shows.
      </SubTitle>
      <div className="create-account-body-content">
        {shuffleMnemonicList.map((item, index) => (
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
      </div>
      <Wrapper>
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
      </Wrapper>
      <ErrorMessage msg={errMsg} />
      <ValidatedWrapper>
        {validateMnemonicList.map(
          (item, index) => item && <span key={index}>{item}</span>
        )}
      </ValidatedWrapper>
    </Container>
  )
}

export default CreateAccount
