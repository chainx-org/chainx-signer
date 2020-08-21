import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  span {
    font-size: 14px;

    &:first-of-type {
      color: #afb1b4;
    }

    &:last-of-type {
      width: 200px;
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
      text-align: right;
    }
  }
`

export default function({ label, value }) {
  return (
    <Wrapper>
      <span>{label}</span>
      <span>{value}</span>
    </Wrapper>
  )
}
