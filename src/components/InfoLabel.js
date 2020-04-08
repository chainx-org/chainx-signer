import styled from 'styled-components'
import React from 'react'

const Wrapper = styled.div`
  opacity: 0.72;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;
`

export default function(props) {
  return <Wrapper>{props.children}</Wrapper>
}
