import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.span`
  font-size: 12px;
  color: #8e9193;
  text-align: center;
  line-height: 16px;
`

export default React.memo(function({ address, length = 5 }) {
  let result = address
  if (address.length > 2 * length) {
    result =
      address.substring(0, 5) + '...' + address.substring(address.length - 5)
  }

  return <Wrapper>{result}</Wrapper>
})
