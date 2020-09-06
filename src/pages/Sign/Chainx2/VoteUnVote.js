import React from 'react'
import DetailAmount from '@pages/Sign/components/DetailAmount'
import { useSelector } from 'react-redux'
import { chainx2ToSignParamsSelector } from '@store/reducers/txSlice'
import { chainx2PcxPrecisionSelector } from '@store/reducers/chainx2AssetSlice'
import toPrecision from '@shared/toPrecision'
import DetailItem from '@pages/RequestSign/components/DetailItem'

export default function() {
  const params = useSelector(chainx2ToSignParamsSelector)
  const precision = useSelector(chainx2PcxPrecisionSelector)

  if (!params) {
    return null
  }

  return (
    <>
      <DetailAmount token="PCX" value={toPrecision(params[1], precision)} />
      <DetailItem label="Dest node" value={params[0]} />
    </>
  )
}
