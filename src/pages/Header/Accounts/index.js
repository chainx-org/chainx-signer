import { useDispatch, useSelector } from 'react-redux'
import {
  chainxAccountsSelector,
  currentChainxAccountSelector,
  setCurrentChainXMainNetAccount,
  setCurrentChainXTestNetAccount
} from '../../../store/reducers/accountSlice'
import React from 'react'
import { isTestNetSelector } from '../../../store/reducers/settingSlice'
import { setShowAccountMenu } from '../../../store/reducers/statusSlice'
import {
  Account,
  AccountDetailWrapper,
  Accounts,
  ActiveFlag,
  ActiveFlagPlaceHolder,
  Name
} from './styledComponents'
import AddressItem from './AddressItem'

export default function({ history }) {
  const accounts = useSelector(chainxAccountsSelector)
  const isTestNet = useSelector(isTestNetSelector)
  const currentAccount = useSelector(currentChainxAccountSelector)
  const dispatch = useDispatch()

  const setAccount = address => {
    if (isTestNet) {
      dispatch(setCurrentChainXTestNetAccount({ address }))
    } else {
      dispatch(setCurrentChainXMainNetAccount({ address }))
    }
    dispatch(setShowAccountMenu(false))
    history.push('/')
  }

  return (
    <Accounts>
      {accounts.map(item => (
        <Account key={item.name} onClick={() => setAccount(item.address)}>
          {item.address === currentAccount.address ? (
            <ActiveFlag />
          ) : (
            <ActiveFlagPlaceHolder />
          )}
          <AccountDetailWrapper>
            <Name>{item.name}</Name>
            <AddressItem address={item.address} />
          </AccountDetailWrapper>
        </Account>
      ))}
    </Accounts>
  )
}
