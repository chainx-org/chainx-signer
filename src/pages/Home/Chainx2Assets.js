import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchChainx2Assets,
  fetchChainx2AssetsInfo,
  normalizedChainx2AssetsSelector
} from '@store/reducers/chainx2AssetSlice'
import { token } from '../../constants'
import {
  NativeAssetWrapper,
  OtherAssetsWrapper
} from '@pages/Home/styledComponents'
import toPrecision, { localString } from '@shared/toPrecision'
import { replaceBTC } from '@shared/chainx'
import { AssetIcon } from '@pages/Home/utils'
import { currentAddressSelector } from '@store/reducers/accountSlice'
import useFetchAsset from '@pages/Home/useFetchAsset'

export default function() {
  const dispatch = useDispatch()

  const assets = useSelector(normalizedChainx2AssetsSelector)
  const nativeTokenName = token.PCX
  const nativeAsset = assets.find(asset => asset.token === nativeTokenName)
  const otherAssets = assets.filter(asset => asset.token !== nativeTokenName)

  const address = useSelector(currentAddressSelector)

  useEffect(() => {
    dispatch(fetchChainx2AssetsInfo())
  }, [dispatch])

  useFetchAsset(address, fetchChainx2Assets)

  return (
    <>
      {nativeAsset && (
        <NativeAssetWrapper>
          <AssetIcon name="PCX2" width={48} />
          <span>Total Balance</span>
          <p>
            <b>
              {localString(
                toPrecision(nativeAsset.balance, nativeAsset.precision)
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
