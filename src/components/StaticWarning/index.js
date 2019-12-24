import React from 'react'
// @ts-ignore
import warningIcon from '../../assets/warning.png'
import './index.scss'

function StaticWarning(props) {
  const {
    title = '',
    desc = 'Do not store the mnemonic words in your PC or Net. Anybody can take your assets with the mnemonic words.'
  } = props

  return (
    <div className="static-warning">
      <img className="warning-icon" src={warningIcon} alt="warning" />
      <span className="warning-title">{title}</span>
      <div className="warning-desc">{desc}</div>
    </div>
  )
}

export default StaticWarning
