import React, { useEffect, useRef, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  isCurrentNodeInit,
  setChainx,
  sleep,
  useOutsideClick
} from '../../shared'
import Icon from '../../components/Icon'
import logo from '../../assets/extension_logo.svg'
import testNetImg from '../../assets/testnet.svg'
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
  showAccountMenuSelector
} from '../../store/reducers/statusSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import {
  chainxNodesDelaySelector,
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

function Header(props) {
  const refNodeList = useRef(null)
  const refAccountList = useRef(null)
  const [showNodeListArea, setShowNodeListArea] = useState(false)
  const accounts = useSelector(chainxAccountsSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const nodeList = useSelector(chainxNodesSelector)
  const chainId = useSelector(networkSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const nodesDelay = useSelector(chainxNodesDelaySelector)
  const currentMainNetNode = useSelector(currentChainXMainNetNodeSelector)
  const currentTestNetNode = useSelector(currentChainXTestNetNodeSelector)
  const showAccountMenu = useSelector(showAccountMenuSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getDelay(nodeList, chainId, dispatch, setNodeDelay)
    // eslint-disable-next-line
  }, [isTestNet, chainId, nodeList])

  useOutsideClick(refNodeList, () => {
    setShowNodeListArea(false)
  })

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  async function setNode(url) {
    dispatch(setInitLoading(true))
    dispatch(setCurrentChainXNode({ chainId, url }))
    setShowNodeListArea(false)
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

  function getDelayClass(delay) {
    if (delay === 'timeout') {
      return 'red'
    } else if (delay > 300) {
      return 'yellow'
    } else if (delay <= 300) {
      return 'green'
    } else {
      return 'green'
    }
  }

  function getDelayText(delay) {
    return delay ? (delay === 'timeout' ? 'timeout' : delay + ' ms') : ''
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
    setShowNodeListArea(false)
    props.history.push('/')
  }

  return (
    <div className="header">
      <div className="container container-header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
          {isTestNet && (
            <img className="testnet" src={testNetImg} alt="testNetImg" />
          )}
        </Link>
        {props.history.location.pathname.includes('requestSign') ? (
          <div className="center-title">
            <span>
              {(
                (props.history.location.query &&
                  props.history.location.query.method) ||
                ''
              )
                .replace(/([A-Z])/g, ' $1')
                .toLowerCase() || 'Sign Request'}
            </span>
          </div>
        ) : (
          <div className="right">
            <div
              ref={refNodeList}
              className="current-node"
              onClick={() => {
                setShowNodeListArea(!showNodeListArea)
                dispatch(setShowAccountMenu(false))
              }}
            >
              <span
                className={
                  'dot ' + getDelayClass(nodesDelay[currentNode.url]) + '-bg'
                }
              />
              <span>{currentNode && currentNode.name}</span>
            </div>
            <div
              ref={refAccountList}
              className="setting"
              onClick={() => {
                dispatch(setShowAccountMenu(!showAccountMenu))
                setShowNodeListArea(false)
              }}
            >
              <Icon name="Menu" className="setting-icon" />
            </div>
          </div>
        )}
        {
          <div className={(showNodeListArea ? '' : 'hide ') + 'node-list-area'}>
            <div className="node-list">
              {currentNode &&
                (nodeList || []).map((item, index) => (
                  <div
                    className={
                      item.name === currentNode.name
                        ? 'node-item active'
                        : 'node-item'
                    }
                    key={item.name}
                    onClick={() => {
                      setNode(item.url)
                    }}
                  >
                    <div className="node-item-active-flag" />
                    <div className="node-item-detail">
                      <div className="node-item-detail-url">
                        <span className="url">
                          {item.url.split('//')[1] || item.url}
                        </span>
                        <div
                          className={
                            isCurrentNodeInit(item, isTestNet)
                              ? 'node-item-detail-edit'
                              : 'node-item-detail-edit custom'
                          }
                          onClick={e => {
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation()
                            setShowNodeListArea(false)
                            const query = {
                              nodeInfo: item,
                              type: 'remove'
                            }
                            props.history.push({
                              pathname: '/addNode',
                              query: query
                            })
                          }}
                        >
                          <Icon name="Edit" />
                        </div>
                      </div>
                      <span
                        className={
                          'delay ' + getDelayClass(nodesDelay[item.url])
                        }
                      >
                        {getDelayText(nodesDelay[item.url])}
                      </span>
                    </div>
                  </div>
                ))}
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
                switchNet()
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
        }
        {showAccountMenu && !showNodeListArea ? (
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
                {accounts.length > 0 && <Accounts history={props.history} />}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Header)
