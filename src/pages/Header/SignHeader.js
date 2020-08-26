import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { chainx2ToSignSelector } from '@store/reducers/txSlice'

const Wrapper = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: #3f3f3f;
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export default function() {
  const extrinsic = useSelector(chainx2ToSignSelector)
  const methodName = extrinsic?.data?.method

  return (
    <Wrapper>
      {(methodName || '').replace(/([A-Z])/g, ' $1').toLowerCase() ||
        'Sign Request'}
    </Wrapper>
  )
}
