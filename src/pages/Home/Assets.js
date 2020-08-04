import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAccountAssets,
  fetchAssetsInfo,
  normalizedAssetsSelector
} from '../../store/reducers/assetSlice'
import styled from 'styled-components'
import { token } from '../../constants'
import toPrecision, { localString } from '../../shared/toPrecision'
import { replaceBTC } from '../../shared/chainx'
import { fetchAssetLoadingSelector } from '../../store/reducers/statusSlice'
import MiniLoading from '../../components/MiniLoading'
import { currentAddressSelector } from '../../store/reducers/accountSlice'
import {
  NativeAssetWrapper,
  OtherAssetsWrapper
} from '@pages/Home/styledComponents'
import { AssetIcon } from '@pages/Home/utils'
import useFetchAssets from '@pages/Home/useFetchAsset'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`

export default function() {
  const assets = useSelector(normalizedAssetsSelector)
  const loading = useSelector(fetchAssetLoadingSelector)
  const dispatch = useDispatch()
  const address = useSelector(currentAddressSelector)

  useEffect(() => {
    dispatch(fetchAssetsInfo())
  }, [dispatch])

  useFetchAssets(address, fetchAccountAssets)

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

      <OtherAssetsWrapper>
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
      </OtherAssetsWrapper>
    </>
  )
}
