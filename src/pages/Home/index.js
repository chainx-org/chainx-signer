import React from 'react'
import { useSelector } from 'react-redux'
import '../index.scss'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import CreateOrImportAccount from './CreateOrImportAccount'
import CurrentAccount from './CurrentAccount'

function Home(props) {
  const currentAccount = useSelector(currentChainxAccountSelector)

  return currentAccount ? (
    <CurrentAccount />
  ) : (
    <CreateOrImportAccount history={props.history} />
  )
}

export default Home
