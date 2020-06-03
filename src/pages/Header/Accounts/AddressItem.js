import React, { useEffect, useRef, useState } from 'react'
import DotInCenterStr from '../../../components/DotInCenterStr'
import Icon from '../../../components/Icon'
import ReactTooltip from 'react-tooltip'
import ClipboardJS from 'clipboard'
import { AddressWrapper } from './styledComponents'

export default function({ address }) {
  const [copyText, setCopyText] = useState('Copy')

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
      clipboard.destroy()
    }
  }, [])

  return (
    <AddressWrapper>
      <DotInCenterStr value={address} />
      <button
        className="account-copy"
        data-clipboard-text={address}
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
    </AddressWrapper>
  )
}
