import { token } from '../../constants'
import btcLogo from '@assets/svg/X-BTC.svg'
import lbtcLogo from '@assets/svg/L-BTC.svg'
import dotLogo from '@assets/svg/DOT.svg'
import pcxLogo from '@assets/svg/PCX.svg'
import pcx2Logo from '@assets/chainx2-logo.svg'
import React from 'react'

export function AssetIcon({ name, width }) {
  const logo = do {
    if ('PCX2' === name) {
      // eslint-disable-next-line no-unused-expressions
      pcx2Logo
    } else if (token.XBTC === name || token.BTC === name) {
      // eslint-disable-next-line no-unused-expressions
      btcLogo
    } else if (token.LBTC === name) {
      // eslint-disable-next-line no-unused-expressions
      lbtcLogo
    } else if (token.SDOT === name) {
      // eslint-disable-next-line no-unused-expressions
      dotLogo
    } else {
      // eslint-disable-next-line no-unused-expressions
      pcxLogo
    }
  }

  return (
    <img src={logo} alt="asset icon" width={width || 32} height={width || 32} />
  )
}
