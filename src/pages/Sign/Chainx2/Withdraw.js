import React from 'react'
import DetailAmount from '@pages/Sign/components/DetailAmount'
import DetailItem from '@pages/Sign/components/DetailItem'
import { useSelector } from 'react-redux'
import { chainx2ToSignParamsSelector } from '@store/reducers/txSlice'
import toPrecision from '@shared/toPrecision'
import { chainx2AssetsInfoSelector } from '@store/reducers/chainx2AssetSlice'

export default function() {
  const params = useSelector(chainx2ToSignParamsSelector)
  const id = params[0]
  const infoArr = useSelector(chainx2AssetsInfoSelector)
  const { info: { decimals: precision, token } = {} } = infoArr.find(
    info => info.id === id
  )

  return (
    <>
      <DetailAmount value={toPrecision(params[1], precision)} token={token} />
      <DetailItem label="Dest" value={params[2]} />
      <DetailItem label="Memo" value={params[3]} />
    </>
  )
}
