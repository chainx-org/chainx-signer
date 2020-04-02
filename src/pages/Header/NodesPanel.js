import Nodes from './Nodes'
import Icon from '../../components/Icon'
import switchImg from '../../assets/switch.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setShowNodeMenu,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice'
import { currentChainxNodeSelector } from '../../store/reducers/nodeSlice'
import { isTestNetSelector } from '../../store/reducers/settingSlice'

export default function({ history, setNode, switchNet }) {
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const dispatch = useDispatch()

  return (
    <div className={(showNodeMenu ? '' : 'hide ') + 'node-list-area'}>
      <div className="node-list">
        {currentNode && <Nodes history={history} setNode={setNode} />}
      </div>
      <div
        className="add-node node-action-item"
        onClick={() => {
          history.push('/addNode')
          dispatch(setShowNodeMenu(false))
        }}
      >
        <Icon name="Add" className="add-node-icon node-action-item-img" />
        <span>Add node</span>
      </div>
      <div
        className="switch-net node-action-item"
        onClick={() => {
          switchNet().then(() => console.log('Net switched'))
        }}
      >
        <img className="node-action-item-img" src={switchImg} alt="switchImg" />
        <span>Switch to {isTestNet ? 'Mainnet' : 'Testnet'}</span>
      </div>
    </div>
  )
}
