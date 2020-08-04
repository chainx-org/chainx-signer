import React, { useRef } from 'react'
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
import Logo from './Logo'
import SignHeader from './SignHeader'
import NodesPanelSwitch from './NodesPanelSwitch'
import AccountPanelSwitch from './AccountPanelSwitch'
import NodesPanel from './NodesPanel'
import AccountsPanel from './AccountsPanel'
import newVersion from '../../assets/new-version.svg'
import { useHistory } from 'react-router'
import useUpdateChainxNodesDelay from '@pages/Header/useUpdateChainxNodesDelay'
import useUpdateChainx2NodesDelay from '@pages/Header/useUpdateChainx2NodesDelay'

function Header() {
  const refAccountList = useRef(null)
  const showAccountMenu = useSelector(showAccountMenuSelector)
  const showNodeMenu = useSelector(showNodeMenuSelector)
  const dispatch = useDispatch()
  const updateInfo = useSelector(updateInfoSelector)

  const history = useHistory()
  useUpdateChainx2NodesDelay()
  useUpdateChainxNodesDelay()

  useOutsideClick(refAccountList, () => {
    dispatch(setShowAccountMenu(false))
  })

  const nowInSignPage = history.location.pathname.includes('requestSign')

  return (
    <div className="header">
      <div className="container container-header">
        <Logo />
        {nowInSignPage ? (
          <SignHeader />
        ) : (
          <div style={{ display: 'flex' }}>
            <NodesPanelSwitch />
            <AccountPanelSwitch />
          </div>
        )}
        <NodesPanel />
        {showAccountMenu && !showNodeMenu ? <AccountsPanel /> : null}
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
