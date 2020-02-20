import React, { useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { setChainx, sleep, useOutsideClick } from '../../shared'
import Icon from '../../components/Icon'
import switchImg from '../../assets/switch.svg'
import './header.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector,
  setNetwork
} from '../../store/reducers/settingSlice'
import { chainxAccountsSelector } from '../../store/reducers/accountSlice'
import {
  setInitLoading,
  setShowAccountMenu,
  setShowNodeMenu,
  showAccountMenuSelector,
  showNodeMenuSelector
} from '../../store/reducers/statusSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import {
  chainxNodesSelector,
  currentChainXMainNetNodeSelector,
  currentChainxNodeSelector,
  currentChainXTestNetNodeSelector,
  setCurrentChainXNode,
  setNodeDelay
} from '../../store/reducers/nodeSlice'
import getDelay from '../../shared/updateNodeStatus'
import { fetchIntentions } from '../../store/reducers/intentionSlice'
import { clearToSign } from '../../store/reducers/txSlice'
import Accounts from './Accounts'
import Nodes from './Nodes'
import Logo from './Logo'
import SignHeader from './SignHeader'
import NodesPanelSwitch from './NodesPanelSwitch'
import AccountPanelSwitch from './AccountPanelSwitch'

function Header(props) {
  const refAccountList = useRef(null)
  const accounts = useSelector(chainxAccountsSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const nodeList = useSelector(chainxNodesSelector)
  const chainId = useSelector(networkSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const currentMainNetNode = useSelector(currentChainXMainNetNodeSelector)
  const currentTestNetNode = useSelector(currentChainXTestNetNodeSelector)
  const showAccountMenu = useSelector(showAccountMenuSelector)
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getDelay(nodeList, chainId, dispatch, setNodeDelay)
    // eslint-disable-next-line
  }, [isTestNet, chainId, nodeList])

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  async function setNode(url) {
    dispatch(setInitLoading(true))
    dispatch(setCurrentChainXNode({ chainId, url }))
    dispatch(setShowNodeMenu(false))
    Promise.race([setChainx(url), sleep(5000)])
      .then(chainx => {
        if (!chainx) {
          props.history.push('/nodeError')
        } else {
          props.history.push('/redirect')
        }
      })
      .catch(e => {
        console.log('switch node error ', e)
        props.history.push('/nodeError')
      })
      .finally(() => {
        dispatch(setInitLoading(false))
      })
  }

  async function switchNet() {
    dispatch(setNetwork(isTestNet ? CHAINX_MAIN : CHAINX_TEST))
    dispatch(clearToSign())

    const node = isTestNet ? currentMainNetNode : currentTestNetNode
    await setNode(node.url)

    if (process.env.NODE_ENV === 'development') {
      console.log('node', node)
    }

    dispatch(fetchIntentions())
    dispatch(setShowNodeMenu(false))
    props.history.push('/')
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('props.history.location', props.history.location)
  }

  const nowInSignPage = props.history.location.pathname.includes('requestSign')

  return (
    <div className="header">
      <div className="container container-header">
        <Logo />
        {nowInSignPage ? (
          <SignHeader history={props.history} />
        ) : (
          <div className="right">
            <NodesPanelSwitch />
            <AccountPanelSwitch />
          </div>
        )}
        <div className={(showNodeMenu ? '' : 'hide ') + 'node-list-area'}>
          <div className="node-list">
            {currentNode && <Nodes history={props.history} setNode={setNode} />}
          </div>
          <div
            className="add-node node-action-item"
            onClick={() => {
              props.history.push('/addNode')
            }}
          >
            <Icon name="Add" className="add-node-icon node-action-item-img" />
            <span>Add node</span>
          </div>
          <div
            className="switch-net node-action-item"
            onClick={() => {
              switchNet().then(() => console.warn('fail to switch net'))
            }}
          >
            <img
              className="node-action-item-img"
              src={switchImg}
              alt="switchImg"
            />
            <span>Switch to {isTestNet ? 'Mainnet' : 'Testnet'}</span>
          </div>
        </div>
        {showAccountMenu && !showNodeMenu ? (
          <div className="account-area">
            <div className="action">
              <div
                onClick={() => {
                  dispatch(setShowAccountMenu(false))
                  props.history.push('/importAccount')
                }}
              >
                <Icon name="Putin" className="account-area-icon" />
                <span>Import</span>
              </div>
              <div
                onClick={() => {
                  dispatch(setShowAccountMenu(false))
                  props.history.push('/createAccount')
                }}
              >
                <Icon name="Add" className="account-area-icon" />
                <span>New</span>
              </div>
            </div>
            {accounts.length > 0 ? (
              <div className="accounts">
                <Accounts history={props.history} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Header)
