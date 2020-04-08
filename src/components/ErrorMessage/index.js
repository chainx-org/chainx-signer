import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  color: red;
  font-size: 16px;
`

function ErrorMessage(props) {
  const { msg } = props

  return <Wrapper>{props.children || msg}</Wrapper>
}

export default ErrorMessage
