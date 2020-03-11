import Loading from './loading.svg'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.i`
  @keyframes circle {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  img {
    animation: circle 2s linear infinite;
    width: 32px;
  }
`

export default function(props) {
  return (
    <Wrapper className={props.className}>
      <img src={Loading} alt="loading" />
    </Wrapper>
  )
}
