import React from 'react'
import './showPrivateKey.scss'
import StaticWarning from '../../components/StaticWarning'

function ShowPrivateKey(props) {
  return (
    <div className="show-private-key">
      <span className="title">Private Key</span>
      <StaticWarning desc="Do not store your private key in your PC or network. Anybody with your private key will take your asseets." />
      <div className="pk">
        <span className="span-center-wrap">{props.location.query.pk}</span>
      </div>
    </div>
  )
}

export default ShowPrivateKey
