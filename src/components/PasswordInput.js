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
  width: 100%;
  padding: 0 20px;
`

export default function({ enter = nonFunc, errMsg }) {
  const [pass, setPass] = useState('')

  return (
    <Wrapper>
      <Title>Input password</Title>
      <InputWrapper>
        <PasswordInput
          className="fixed-width"
          value={pass}
          onChange={setPass}
          style={{ width: '100%' }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              enter(pass)
            }
          }}
          placeholder="Password"
        />
      </InputWrapper>
      <ButtonLine>
        <PrimaryButton size="large" onClick={() => enter(pass)}>
          Confirm
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </Wrapper>
  )
}
