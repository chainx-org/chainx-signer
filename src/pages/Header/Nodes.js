import { useDispatch, useSelector } from 'react-redux'
import {
  chainxNodesDelaySelector,
  chainxNodesSelector,
  currentChainxNodeSelector
} from '../../store/reducers/nodeSlice'
import Icon from '../../components/Icon'
import React from 'react'
import { setShowNodeMenu } from '../../store/reducers/statusSlice'
import Delay from './Delay'

export default function({ history, setNode }) {
  const nodeList = useSelector(chainxNodesSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const nodesDelay = useSelector(chainxNodesDelaySelector)
  const dispatch = useDispatch()

  return (nodeList || []).map((item, index) => (
    <div
      className={
        item.name === currentNode.name ? 'node-item active' : 'node-item'
      }
      key={item.name}
      onClick={() => {
        setNode(item.url)
      }}
    >
      <div className="node-item-active-flag" />
      <div className="node-item-detail">
        <div className="node-item-detail-url">
          <span className="url">{item.url.split('//')[1] || item.url}</span>
          <div
            className={
              item.isInit
                ? 'node-item-detail-edit'
                : 'node-item-detail-edit custom'
            }
            onClick={e => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              dispatch(setShowNodeMenu(false))
              const query = {
                nodeInfo: item,
                type: 'remove'
              }
              history.push({
                pathname: '/addNode',
                query: query
              })
            }}
          >
            <Icon name="Edit" />
          </div>
        </div>
        <Delay delay={nodesDelay[item.url]} />
      </div>
    </div>
  ))
}
