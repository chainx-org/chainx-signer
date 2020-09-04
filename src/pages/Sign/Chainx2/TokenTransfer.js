import React from 'react'
import DetailAmount from '@pages/Sign/components/DetailAmount'
import DetailItem from '@pages/Sign/components/DetailItem'
import { useSelector } from 'react-redux'
import { chainx2ToSignParamsSelector } from '@store/reducers/txSlice'
import { chainx2AssetsInfoSelector } from '@store/reducers/chainx2AssetSlice'
import toPrecision from '@shared/toPrecision'

export default function() {
  const params = useSelector(chainx2ToSignParamsSelector)
  const id = params[1]
  const infoArr = useSelector(chainx2AssetsInfoSelector)
  const { info: { decimals: precision, token } = {} } = infoArr.find(
    info => info.id === id
  )

  if (!params) {
    return null
  }

  return (
    <>
      <DetailAmount token={token} value={toPrecision(params[2], precision)} />
      <DetailItem label="Dest" value={params[0]} />
      <DetailItem label="Memo" value={params[3]} />
    </>
  )
}
