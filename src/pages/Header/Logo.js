import { Link } from 'react-router-dom'
import logo from '../../assets/extension_logo.svg'
import testNetImg from '../../assets/testnet.svg'
import React from 'react'
import { useSelector } from 'react-redux'
import { isTestNetSelector } from '../../store/reducers/settingSlice'

export default function() {
  const isTestNet = useSelector(isTestNetSelector)

  return (
    <Link to="/">
      <img className="logo" src={logo} alt="logo" />
      {isTestNet && (
        <img className="testnet" src={testNetImg} alt="testNetImg" />
      )}
    </Link>
  )
}
