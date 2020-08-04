import Nodes from './Nodes'
import Icon from '../../components/Icon'
import switchImg from '../../assets/switch.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice'
import {
  currentChainXMainNetNodeSelector,
  currentChainXTestNetNodeSelector,
  currentNodeSelector,
  setCurrentNode
} from '@store/reducers/nodeSlice'
import {
  isTestNetSelector,
  networkSelector,
  setNetwork
} from '../../store/reducers/settingSlice'
import { paths } from '../../constants'
import { useHistory } from 'react-router'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import { clearToSign } from '../../store/reducers/txSlice'
import { fetchIntentions } from '../../store/reducers/intentionSlice'

export default function() {
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const currentNode = useSelector(currentNodeSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()
  const history = useHistory()
  const currentMainNetNode = useSelector(currentChainXMainNetNodeSelector)
  const currentTestNetNode = useSelector(currentChainXTestNetNodeSelector)
  const chainId = useSelector(networkSelector)
  const isChainx = [CHAINX_MAIN, CHAINX_TEST].includes(chainId)

  async function setNode(url) {
    if (currentNode.url === url) {
      return
    }

    dispatch(setCurrentNode({ chainId, url }))
    dispatch(setShowNodeMenu(false))
  }

  async function switchNet() {
    dispatch(setNetwork(isTestNet ? CHAINX_MAIN : CHAINX_TEST))
    dispatch(clearToSign())

    const node = isTestNet ? currentMainNetNode : currentTestNetNode
    await setNode(node.url)

    dispatch(fetchIntentions())
    history.push('/')
  }

  return (
    <div className={(showNodeMenu ? '' : 'hide ') + 'node-list-area'}>
      <div className="node-list">{currentNode && <Nodes />}</div>
      <div
        className={`add-node node-action-item ${
          !isChainx ? 'radius-bottom' : ''
        }`}
        onClick={() => {
          history.push(paths.addNode)
          dispatch(setShowNodeMenu(false))
        }}
      >
        <Icon name="Add" className="add-node-icon node-action-item-img" />
        <span>Add node</span>
      </div>
      {isChainx && (
        <div
          className="radius-bottom node-action-item"
          onClick={() => {
            switchNet().then(() => console.log('Net switched'))
          }}
        >
          <img
            className="node-action-item-img"
            src={switchImg}
            alt="switchImg"
          />
          <span>Switch to {isTestNet ? 'Mainnet' : 'Testnet'}</span>
        </div>
      )}
    </div>
  )
}
