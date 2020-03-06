import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    &:first-of-type {
      font-size: 12px;
      color: #afb1b4;
    }
    &:last-of-type {
      font-size: 20px;
      color: #ecb417;
    }
  }
`

export default function({ value, token }) {
  return (
    <Wrapper>
      <span>Amount</span>
      <span>
        {value} {token}
      </span>
    </Wrapper>
  )
}
