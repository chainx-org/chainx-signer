import { useDispatch, useSelector } from 'react-redux'
import {
  chainxAccountsSelector,
  currentChainxAccountSelector,
  setCurrentChainXMainNetAccount,
  setCurrentChainXTestNetAccount
} from '../../store/reducers/accountSlice'
import DotInCenterStr from '../../components/DotInCenterStr'
import Icon from '../../components/Icon'
import ReactTooltip from 'react-tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { isTestNetSelector } from '../../store/reducers/settingSlice'
import { setShowAccountMenu } from '../../store/reducers/statusSlice'
import ClipboardJS from 'clipboard'

export default function({ history }) {
  const accounts = useSelector(chainxAccountsSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const currentAccount = useSelector(currentChainxAccountSelector)
  const [copyText, setCopyText] = useState('Copy')
  const dispatch = useDispatch()

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true

    const clipboard = new ClipboardJS('.account-copy')
    clipboard.on('success', function() {
      if (mounted.current) {
        setCopyText('Copied!')
      }
    })

    return () => {
      mounted.current = false
    }
  }, [])

  return accounts.map(item => (
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
        dispatch(setShowAccountMenu(false))
        history.push('/')
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
  ))
}
