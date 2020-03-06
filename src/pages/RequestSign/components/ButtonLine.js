import styled from 'styled-components'
import React from 'react'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
`

export default function({ children }) {
  return <Wrapper>{children}</Wrapper>
}
