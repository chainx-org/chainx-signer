import React from 'react'
import { toSignExtrinsicSelector } from '../../store/reducers/txSlice'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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
  const extrinsic = useSelector(toSignExtrinsicSelector)
  const methodName = extrinsic && extrinsic.methodName

  return (
    <Wrapper>
      {(methodName || '').replace(/([A-Z])/g, ' $1').toLowerCase() ||
        'Sign Request'}
    </Wrapper>
  )
}
