import styled from 'styled-components'
import React, { useState } from 'react'
import { ButtonLine, InputWrapper, Title } from './styled'
import { PasswordInput } from '@chainx/ui'
import { nonFunc } from '../utils'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'
import ErrorMessage from './ErrorMessage'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`

export default function({ enter = nonFunc, errMsg, onChange = nonFunc }) {
  const [pass, setPass] = useState('')
  const [innerErrMsg, setInnerErrMsg] = useState('')

  const confirm = () => {
    if (!pass) {
      return setInnerErrMsg('Password required')
    }

    enter(pass)
  }

  const err = innerErrMsg || errMsg

  return (
    <Wrapper>
      <Title>Input password</Title>
      <InputWrapper>
        <PasswordInput
          className="fixed-width"
          value={pass}
          onChange={v => {
            setPass(v)
            setInnerErrMsg('')
            onChange(v)
          }}
          style={{ width: '100%' }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              confirm()
            }
          }}
          placeholder="Password"
        />
      </InputWrapper>
      <ErrorMessage msg={err} />
      <ButtonLine>
        <PrimaryButton size="large" onClick={confirm}>
          Confirm
        </PrimaryButton>
      </ButtonLine>
    </Wrapper>
  )
}
