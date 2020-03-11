import { useSelector } from 'react-redux'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import Address from './Address'
import Icon from '../../components/Icon'
import ReactTooltip from 'react-tooltip'
import ClipboardJS from 'clipboard'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  text-align: center;
  header {
    font-weight: bold;
    font-size: 16px;
    color: #3f3f3f;
    line-height: 24px;
  }

  main {
    display: flex;
    align-items: center;
    position: relative;
    & > span:last-of-type {
      position: absolute;
      right: -16px;
      i {
        font-size: 12px;
        color: #f6c94a;
        cursor: pointer;
      }
    }
  }
`

export default function() {
  const { name, address } = useSelector(currentChainxAccountSelector)
  const [copyText, setCopyText] = useState('Copy')

  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const clipBoard = new ClipboardJS('#current-account-copy')
    clipBoard.on('success', function() {
      if (mounted.current) {
        setCopyText('Copied!')
      }
    })

    return function() {
      clipBoard.destroy()
      mounted.current = false
    }
  }, [])

  return (
    <Wrapper>
      <header>{name}</header>
      <main>
        <Address address={address} />
        <span
          id="current-account-copy"
          data-tip
          data-for="account-copy-address-tooltip"
          onClick={e => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
          }}
          data-clipboard-text={address}
        >
          <Icon name="copy" />
        </span>
        <ReactTooltip
          id="account-copy-address-tooltip"
          effect="solid"
          globalEventOff="click"
          afterHide={() => setCopyText('Copy')}
        >
          <span>{copyText}</span>
        </ReactTooltip>
      </main>
    </Wrapper>
  )
}
