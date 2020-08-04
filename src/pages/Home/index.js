import React from 'react'
import { useSelector } from 'react-redux'
import '../index.scss'
import { currentAccountSelector } from '../../store/reducers/accountSlice'
import CreateOrImportAccount from './CreateOrImportAccount'
import CurrentAccount from './CurrentAccount'
import Assets from './Assets'
import { CHAINX2_TEST } from '@store/reducers/constants'
import Chainx2Assets from '@pages/Home/Chainx2Assets'
import { networkSelector } from '@store/reducers/settingSlice'

function Home() {
  const chainId = useSelector(networkSelector)
  const account = useSelector(currentAccountSelector)
  const isChainx2 = [CHAINX2_TEST].includes(chainId)

  return account ? (
    <>
      <CurrentAccount />
      {isChainx2 ? <Chainx2Assets /> : <Assets />}
    </>
  ) : (
    <CreateOrImportAccount />
  )
}

export default Home
