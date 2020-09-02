import { useSelector } from 'react-redux'
import { chainx2ToSignParamsSelector } from '@store/reducers/txSlice'
import DetailItem from '@pages/RequestSign/components/DetailItem'
import React, { useEffect, useState } from 'react'
import { chainx2AssetsInfoSelector } from '@store/reducers/chainx2AssetSlice'
import { getToken } from '@pages/Sign/Chainx2/utils'
import { pairsSelector } from '@store/reducers/chainx2DexSlice'

export default function() {
  const params = useSelector(chainx2ToSignParamsSelector) || []
  const assetsInfo = useSelector(chainx2AssetsInfoSelector)
  console.log('assetsInfo', assetsInfo)
  const [pairInfo, setPairInfo] = useState()
  const pairs = useSelector(pairsSelector)

  useEffect(() => {
    if (params.length <= 0 || assetsInfo.length <= 0 || pairs.length <= 0) {
      return
    }

    const pairId = params[0]
    const pair = pairs.find(p => p.id === pairId)
    const { baseCurrency, quoteCurrency } = pair
    setPairInfo(
      `${getToken(baseCurrency, assetsInfo)}/${getToken(
        quoteCurrency,
        assetsInfo
      )}`
    )
  }, [params, assetsInfo, pairs])

  return (
    <>
      <DetailItem label="Trade pair" value={pairInfo} />
      <DetailItem label="Id" value={params[1]} />
    </>
  )
}
