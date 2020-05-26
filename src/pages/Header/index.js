import React, { useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { useOutsideClick } from '../../shared'
import './header.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  setShowAccountMenu,
  showAccountMenuSelector,
  showNodeMenuSelector,
  updateInfoSelector
} from '../../store/reducers/statusSlice'
import getDelay from '../../shared/updateNodeStatus'
import Logo from './Logo'
import SignHeader from './SignHeader'
import NodesPanelSwitch from './NodesPanelSwitch'
import AccountPanelSwitch from './AccountPanelSwitch'
import NodesPanel from './NodesPanel'
import AccountsPanel from './AccountsPanel'
import newVersion from '../../assets/new-version.svg'

function Header(props) {
  const refAccountList = useRef(null)
  const showAccountMenu = useSelector(showAccountMenuSelector)
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const dispatch = useDispatch()
  const updateInfo = useSelector(updateInfoSelector)

  useEffect(() => {
    getDelay()
      .then(() => console.log('Delay info updated'))
      .catch(() => console.log('Failed to update delay info'))

    const intervalId = setInterval(() => {
      getDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'))
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  const nowInSignPage = props.history.location.pathname.includes('requestSign')

  return (
    <div className="header">
      <div className="container container-header">
        <Logo />
        {nowInSignPage ? (
          <SignHeader history={props.history} />
        ) : (
          <div style={{ display: 'flex' }}>
            <NodesPanelSwitch />
            <AccountPanelSwitch />
          </div>
        )}
        <NodesPanel />
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
