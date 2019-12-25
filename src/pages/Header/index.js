import React, { useEffect, useRef, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ClipboardJS from 'clipboard'
import ReactTooltip from 'react-tooltip'
import { useRedux, useOutsideClick, isCurrentNodeInit } from '../../shared'
import { setChainxNode } from '../../messaging'
import Icon from '../../components/Icon'
import DotInCenterStr from '../../components/DotInCenterStr'
import logo from '../../assets/extension_logo.svg'
import testNetImg from '../../assets/testnet.svg'
import switchImg from '../../assets/switch.svg'
import './header.scss'
import { useSelector, useDispatch } from 'react-redux'
import {
  isTestNetSelector,
  setNetwork
} from '../../store/reducers/settingSlice'
import {
  currentChainxAccountSelector,
  chainxAccountsSelector,
  setCurrentChainXTestNetAccount,
  setCurrentChainXMainNetAccount
} from '../../store/reducers/accountSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import {
  currentChainxNodeSelector,
  chainxNodesSelector,
  setCurrentChainXMainNetNode,
  setCurrentChainXTestNetNode
} from '../../store/reducers/nodeSlice'

function Header(props) {
  const refNodeList = useRef(null)
  const refAccountList = useRef(null)
  const [showNodeListArea, setShowNodeListArea] = useState(false)
  const [showAccountArea, setShowAccountArea] = useState(false)
  const [copyText, setCopyText] = useState('Copy')
  const currentAccount = useSelector(currentChainxAccountSelector)
  const accounts = useSelector(chainxAccountsSelector)
  const currentNode = useSelector(currentChainxNodeSelector)
  const nodeList = useSelector(chainxNodesSelector)
  const [{ delayList }, setDelayList] = useRedux('delayList', [])
  const [{ testDelayList }, setTestDelayList] = useRedux('testDelayList', [])
  const [{ currentDelay }, setCurrentDelay] = useRedux('currentDelay', 0)
  const [{ currentTestDelay }, setCurrentTestDelay] = useRedux(
    'currentTestDelay',
    0
  )

  const dispatch = useDispatch()
  const isTestNet = useSelector(isTestNetSelector)

  useEffect(() => {
    // updateNodeStatus(
    //   setCurrentNode,
    //   isTestNet ? setCurrentTestDelay : setCurrentDelay,
    //   setNodeList,
    //   isTestNet ? testDelayList : delayList,
    //   isTestNet ? setTestDelayList : setDelayList,
    //   isTestNet
    // )
    setCopyEvent()
    // eslint-disable-next-line
  }, [isTestNet])

  useOutsideClick(refNodeList, () => {
    setShowNodeListArea(false)
  })

  useOutsideClick(refAccountList, () => {
    setShowAccountArea(false)
  })

  function getCurrentDelay(_isTestNet) {
    if (_isTestNet) {
      return currentTestDelay
    } else {
      return currentDelay
    }
  }

  function getDelayList(_isTestNet) {
    if (_isTestNet) {
      return testDelayList
    } else {
      return delayList
    }
  }

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.account-copy')
    clipboard.on('success', function() {
      setCopyText('Copied!')
    })
  }

  async function setNode(url) {
    if (isTestNet) {
      dispatch(setCurrentChainXTestNetNode({ url }))
    } else {
      dispatch(setCurrentChainXMainNetNode({ url }))
    }
    setShowNodeListArea(false)
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

  function switchNet() {
    dispatch(setNetwork(isTestNet ? CHAINX_MAIN : CHAINX_TEST))
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
                setShowAccountArea(false)
              }}
            >
              <span
                className={
                  'dot ' + getDelayClass(getCurrentDelay(isTestNet)) + '-bg'
                }
              />
              <span>{currentNode && currentNode.name}</span>
            </div>
            <div
              ref={refAccountList}
              className="setting"
              onClick={() => {
                setShowAccountArea(!showAccountArea)
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
                          'delay ' +
                          getDelayClass(
                            getDelayList(isTestNet) &&
                              getDelayList(isTestNet)[index]
                          )
                        }
                      >
                        {getDelayText(
                          getDelayList(isTestNet) &&
                            getDelayList(isTestNet)[index]
                        )}
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
        {showAccountArea && !showNodeListArea ? (
          <div className="account-area">
            <div className="action">
              <div
                onClick={() => {
                  setShowAccountArea(false)
                  props.history.push('/importAccount')
                }}
              >
                <Icon name="Putin" className="account-area-icon" />
                <span>Import</span>
              </div>
              <div
                onClick={() => {
                  setShowAccountArea(false)
                  props.history.push('/createAccount')
                }}
              >
                <Icon name="Add" className="account-area-icon" />
                <span>New</span>
              </div>
            </div>
            {accounts.length > 0 ? (
              <div className="accounts">
                {accounts.length > 0 &&
                  accounts.map(item => (
                    <div
                      className={
                        item.address === currentAccount.address
                          ? 'account-item active'
                          : 'account-item'
                      }
                      key={item.name}
                      onClick={async () => {
                        if (isTestNet) {
                          dispatch(
                            setCurrentChainXTestNetAccount({
                              address: item.address
                            })
                          )
                        } else {
                          dispatch(
                            setCurrentChainXMainNetAccount({
                              address: item.address
                            })
                          )
                        }
                        setShowAccountArea(false)
                        props.history.push('/')
                      }}
                    >
                      <div className="account-item-active-flag" />
                      <div className="account-item-detail">
                        <span className="name">{item.name}</span>
                        <div className="address">
                          <DotInCenterStr value={item.address} />
                          <button
                            className="account-copy"
                            data-clipboard-text={item.address}
                            onClick={e => {
                              e.stopPropagation()
                              e.nativeEvent.stopImmediatePropagation()
                            }}
                            data-tip
                            data-for="copy-address-tooltip"
                          >
                            <Icon className="copy-icon" name="copy" />
                          </button>
                          <ReactTooltip
                            id="copy-address-tooltip"
                            effect="solid"
                            globalEventOff="click"
                            className="extension-tooltip"
                            afterHide={() => setCopyText('Copy')}
                          >
                            <span>{copyText}</span>
                          </ReactTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Header)
