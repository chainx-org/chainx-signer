import {
  setShowAccountMenu,
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice'
import { getDelayClass } from './utils'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  chainxNodesDelaySelector,
  currentChainxNodeSelector
} from '../../store/reducers/nodeSlice'
import { useOutsideClick } from '../../shared'

export default function() {
  const refNodeList = useRef(null)
  const dispatch = useDispatch()
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const nodesDelay = useSelector(chainxNodesDelaySelector)
  const currentNode = useSelector(currentChainxNodeSelector)

  useOutsideClick(refNodeList, () => {
    dispatch(setShowNodeMenu(false))
  })

  return (
    <div
      ref={refNodeList}
      className="current-node"
      onClick={() => {
        dispatch(setShowNodeMenu(!showNodeMenu))
        dispatch(setShowAccountMenu(false))
      }}
    >
      <span
        className={'dot ' + getDelayClass(nodesDelay[currentNode.url]) + '-bg'}
      />
      <span>{currentNode && currentNode.name}</span>
    </div>
  )
}
