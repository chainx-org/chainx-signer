import {
  setShowAccountMenu,
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainxNodeSelector } from '../../store/reducers/nodeSlice'
import { useOutsideClick } from '../../shared'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 13px;
  height: 32px;
  width: 123px;
  border-radius: 16px;
  border: 1px solid #dce0e2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 26px;
  cursor: pointer;
`

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-right: 6px;
  background-color: ${props =>
    props.delay === 'timeout'
      ? '#DE071C'
      : props.delay > 300
      ? '#ECB417'
      : '#2CAA84'};
`

export default function() {
  const refNodeList = useRef(null)
  const dispatch = useDispatch()
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const currentNode = useSelector(currentChainxNodeSelector)

  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false))
  })

  return (
    <Wrapper
      ref={refNodeList}
      onClick={() => {
        dispatch(setShowNodeMenu(!showNodeMenu))
        dispatch(setShowAccountMenu(false))
      }}
    >
      <Dot delay={currentNode && currentNode.delay} />
      <span>{currentNode && currentNode.name}</span>
    </Wrapper>
  )
}
