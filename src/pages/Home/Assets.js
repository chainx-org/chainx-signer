import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAccountAssets,
  fetchAssetsInfo,
  normalizedAssetsSelector
} from '../../store/reducers/assetSlice'
import styled from 'styled-components'
import dotLogo from '../../assets/svg/DOT.svg'
import btcLogo from '../../assets/svg/X-BTC.svg'
import lbtcLogo from '../../assets/svg/L-BTC.svg'
import pcxLogo from '../../assets/svg/PCX.svg'
import { token } from '../../constants'
import toPrecision, { localString } from '../../shared/toPrecision'
import { replaceBTC } from '../../shared/chainx'
import { fetchAssetLoadingSelector } from '../../store/reducers/statusSlice'
import MiniLoading from '../../components/MiniLoading'
import { currentAddressSelector } from '../../store/reducers/accountSlice'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`

const NativeAssetWrapper = styled.div`
  padding: 32px 0;
  border-top: 1px solid #dce0e2;

  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    margin-top: 16px;
    font-size: 12px;
    color: #8e9193;
    text-align: center;
    line-height: 1;
  }

  p {
    font-size: 20px;
    color: #3f3f3f;
    margin: 8px 0 0;
  }
`

const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid #dce0e2;
    span {
      font-weight: bold;
      font-size: 14px;
      color: #3f3f3f;
      text-align: right;
      line-height: 20px;
    }
  }
`

export default function() {
  const assets = useSelector(normalizedAssetsSelector)
  const loading = useSelector(fetchAssetLoadingSelector)
  const dispatch = useDispatch()
  const address = useSelector(currentAddressSelector)

  useEffect(() => {
    dispatch(fetchAssetsInfo())
  }, [dispatch])

  useEffect(() => {
    if (!address) {
      return
    }

    dispatch(fetchAccountAssets(address, true))

    const intervalId = setInterval(() => {
      dispatch(fetchAccountAssets(address))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [dispatch, address])

  if (loading) {
    return (
      <LoadingWrapper>
        <MiniLoading />
      </LoadingWrapper>
    )
  }

  const nativeTokenName = token.PCX
  const nativeAsset = assets.find(asset => asset.name === nativeTokenName)
  const otherAssets = assets.filter(asset => asset.name !== nativeTokenName)
  const nativeValue =
    nativeAsset &&
    Object.values(nativeAsset.details).reduce((result, v) => result + v, 0)

  return (
    <>
      {nativeAsset && (
        <NativeAssetWrapper>
          <AssetIcon name={token.PCX} />
          <span>Total Balance</span>
          <p>
            <b>
              {localString(toPrecision(nativeValue, nativeAsset.precision))}{' '}
              {replaceBTC(nativeAsset.name)}
            </b>
          </p>
        </NativeAssetWrapper>
      )}

      <Wrapper>
        {otherAssets.map(({ name, precision, details }) => {
          const value = Object.values(details).reduce(
            (result, v) => result + v,
            0
          )

          return (
            <li key={name}>
              <AssetIcon name={name} />
              <span>
                {localString(toPrecision(value, precision))} {replaceBTC(name)}
              </span>
            </li>
          )
        })}
      </Wrapper>
    </>
  )
}

function AssetIcon({ name }) {
  const logo = do {
    if (token.XBTC === name) {
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

  return <img src={logo} alt="asset icon" width="32" height="32" />
}
