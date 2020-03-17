import React from 'react'
import { useSelector } from 'react-redux'
import '../index.scss'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import CreateOrImportAccount from './CreateOrImportAccount'
import CurrentAccount from './CurrentAccount'
import Assets from './Assets'

function Home() {
  const currentAccount = useSelector(currentChainxAccountSelector)

  return currentAccount ? (
    <>
      <CurrentAccount />
      <Assets />
    </>
  ) : (
    <CreateOrImportAccount />
  )
}

export default Home
