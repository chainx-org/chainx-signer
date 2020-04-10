import React from 'react'
// @ts-ignore
import warningIcon from '../../assets/warning.png'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & > span {
    margin-top: 16px;
    font-size: 16px;
    color: #3f3f3f;
    font-weight: 500;
  }
  & > img {
    width: 64px;
    height: 56px;
  }
  & > div {
    margin-top: 16px;
    font-size: 14px;
    width: 246px;
    color: #666666;
    text-align: center;
  }
`

function StaticWarning(props) {
  const {
    title = '',
    desc = 'Do not store the mnemonic words in your PC or Net. Anybody can take your assets with the mnemonic words.'
  } = props

  return (
    <Wrapper>
      <img src={warningIcon} alt="warning" />
      <span>{title}</span>
      <div>{desc}</div>
    </Wrapper>
  )
}

export default StaticWarning
