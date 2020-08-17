import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchChainx2Assets,
  fetchChainx2AssetsInfo,
  fetchChainx2NativeAsset,
  fetchChainx2NativeAssetInfo,
  normalizedChainx2AssetsSelector,
  normalizedChainx2NativeAssetSelector
} from '@store/reducers/chainx2AssetSlice'
import { token } from '../../constants'
import {
  NativeAssetWrapper,
  OtherAssetsWrapper
} from '@pages/Home/styledComponents'
import toPrecision, { bigAdd, localString } from '@shared/toPrecision'
import { replaceBTC } from '@shared/chainx'
import { AssetIcon } from '@pages/Home/utils'
import { currentAddressSelector } from '@store/reducers/accountSlice'
import useFetchAsset from '@pages/Home/useFetchAsset'

export default function() {
  const dispatch = useDispatch()

  const assets = useSelector(normalizedChainx2AssetsSelector)
  const nativeTokenName = token.PCX
  const otherAssets = assets.filter(asset => asset.token !== nativeTokenName)
  const nativeAsset = useSelector(normalizedChainx2NativeAssetSelector)

  const address = useSelector(currentAddressSelector)

  useEffect(() => {
    dispatch(fetchChainx2AssetsInfo())
    dispatch(fetchChainx2NativeAssetInfo())
  }, [dispatch])

  useFetchAsset(address, useCallback(fetchChainx2Assets, []))
  useFetchAsset(address, useCallback(fetchChainx2NativeAsset, []))

  return (
    <>
      {nativeAsset && (
        <NativeAssetWrapper>
          <AssetIcon name="PCX2" width={48} />
          <span>Total Balance</span>
          <p>
            <b>
              {localString(
                toPrecision(
                  bigAdd(nativeAsset.data.free, nativeAsset.data.reserved),
                  nativeAsset.precision
                )
              )}{' '}
              {replaceBTC(nativeAsset.token)}
            </b>
          </p>
        </NativeAssetWrapper>
      )}

      <OtherAssetsWrapper>
        {otherAssets.map(({ balance: value, token: name, precision }) => {
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
