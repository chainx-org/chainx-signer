import { useDispatch, useSelector } from 'react-redux'
import {
  chainxNodesDelaySelector,
  chainxNodesSelector,
  currentChainxNodeSelector
} from '../../store/reducers/nodeSlice'
import { isCurrentNodeInit } from '../../shared'
import Icon from '../../components/Icon'
import React from 'react'
import { isTestNetSelector } from '../../store/reducers/settingSlice'
import { setShowNodeMenu } from '../../store/reducers/statusSlice'
import { getDelayClass, getDelayText } from './utils'

export default function({ history, setNode }) {
  const nodeList = useSelector(chainxNodesSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const isTestNet = useSelector(isTestNetSelector)
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
              isCurrentNodeInit(item, isTestNet)
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
        <span className={'delay ' + getDelayClass(nodesDelay[item.url])}>
          {getDelayText(nodesDelay[item.url])}
        </span>
      </div>
    </div>
  ))
}
