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
      <img src={logo} alt="logo" width={32} height={32} />
      {isTestNet && (
        <img
          src={testNetImg}
          alt="testNetImg"
          style={{ position: 'absolute', marginBottom: 24 }}
        />
      )}
    </Link>
  )
}
