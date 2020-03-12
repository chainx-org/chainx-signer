import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  span {
    color: #f6c94a;
    font-size: 16px;
  }
`

export default function(props) {
  const { msg } = props

  return (
    <Wrapper>
      <span>{msg}</span>
    </Wrapper>
  )
}
