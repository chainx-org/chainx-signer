import React, { useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { setChainx, sleep, useOutsideClick } from '../../shared'
import './header.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  isTestNetSelector,
  networkSelector,
  setNetwork
} from '../../store/reducers/settingSlice'
import {
  setInitLoading,
  setShowAccountMenu,
  setShowNodeMenu,
  showAccountMenuSelector,
  showNodeMenuSelector,
  updateInfoSelector
} from '../../store/reducers/statusSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '../../store/reducers/constants'
import {
  currentChainXMainNetNodeSelector,
  currentChainXTestNetNodeSelector,
  setCurrentChainXNode
} from '../../store/reducers/nodeSlice'
import getDelay from '../../shared/updateNodeStatus'
import { fetchIntentions } from '../../store/reducers/intentionSlice'
import { clearToSign } from '../../store/reducers/txSlice'
import Logo from './Logo'
import SignHeader from './SignHeader'
import NodesPanelSwitch from './NodesPanelSwitch'
import AccountPanelSwitch from './AccountPanelSwitch'
import NodesPanel from './NodesPanel'
import AccountsPanel from './AccountsPanel'
import newVersion from '../../assets/new-version.svg'

function Header(props) {
  const refAccountList = useRef(null)
  const chainId = useSelector(networkSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const currentMainNetNode = useSelector(currentChainXMainNetNodeSelector)
  const currentTestNetNode = useSelector(currentChainXTestNetNodeSelector)
  const showAccountMenu = useSelector(showAccountMenuSelector)
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const dispatch = useDispatch()
  const updateInfo = useSelector(updateInfoSelector)

  useEffect(() => {
    const intervalId = setInterval(() => {
      getDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'))
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    getDelay()
      .then(() => console.log('Delay info updated'))
      .catch(() => console.log('Failed to update delay info'))
    // eslint-disable-next-line
  }, [isTestNet])

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  async function setNode(url) {
    dispatch(setInitLoading(true))
    dispatch(setCurrentChainXNode({ chainId, url }))
    dispatch(setShowNodeMenu(false))
    Promise.race([setChainx(url), sleep(10000)])
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
        <NodesPanel
          history={props.history}
          setNode={setNode}
          switchNet={switchNet}
        />
        {showAccountMenu && !showNodeMenu ? (
          <AccountsPanel history={props.history} />
        ) : null}
      </div>
      {updateInfo && updateInfo.hasNewVersion && (
        <span
          onClick={event => {
            event.preventDefault()
            window.openExternal(updateInfo.versionInfo.path)
          }}
        >
          <img src={newVersion} alt="new version" />
        </span>
      )}
    </div>
  )
}

export default withRouter(Header)
