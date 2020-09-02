import React from 'react'
import { useSelector } from 'react-redux'
import { chainx2ToSignParamsSelector } from '@store/reducers/txSlice'
import DetailItem from '@pages/RequestSign/components/DetailItem'

export default function() {
  const params = useSelector(chainx2ToSignParamsSelector)

  if (!params) {
    return null
  }

  return (
    <>
      <DetailItem label="Dest node" value={params[0]} />
      <DetailItem label="Unbonded Index" value={params[1]} />
    </>
  )
}
