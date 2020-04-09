import React from 'react'
import styled from 'styled-components'

const RedDelay = styled.span`
  color: #de071c;
`

const YellowDelay = styled.span`
  color: #ecb417;
`

const GreenDelay = styled.span`
  color: #2caa84;
`

export default function({ delay }) {
  function getDelayText(delay) {
    if (!delay) {
      return ''
    }

    if (delay === 'timeout') {
      return 'timeout'
    }

    if (delay > 1000) {
      return `${(delay / 1000).toFixed(1)} s`
    }

    return `${delay} ms`
  }

  const text = getDelayText(delay)

  if (delay === 'timeout' || !delay) {
    return <RedDelay>{text}</RedDelay>
  }

  if (delay > 300) {
    return <YellowDelay>{text}</YellowDelay>
  }

  return <GreenDelay>{text}</GreenDelay>
}
