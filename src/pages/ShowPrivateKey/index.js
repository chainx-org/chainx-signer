import React from 'react'
import './showPrivateKey.scss'
import StaticWarning from '../../components/StaticWarning'
import styled from 'styled-components'
import { Title } from '../../components/styled'

const KeyWrapper = styled.span`
  font-size: 14px;
  color: #000000;
  text-align: center;
  line-height: 20px;
  opacity: 0.87;

  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
`

function ShowPrivateKey(props) {
  return (
    <div className="show-private-key">
      <Title>Private Key</Title>
      <StaticWarning desc="Do not store your private key in your PC or network. Anybody with your private key will take your asseets." />
      <div className="pk">
        <KeyWrapper>{props?.location?.query?.pk}</KeyWrapper>
      </div>
    </div>
  )
}

export default ShowPrivateKey
