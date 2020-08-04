import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { networkSelector } from '../../../store/reducers/settingSlice'
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
import { useHistory } from 'react-router'
import {
  accountsSelector,
  currentAccountSelector,
  setCurrentAccount
} from '@store/reducers/accountSlice'

export default function() {
  const history = useHistory()
  const currentAccount = useSelector(currentAccountSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const accounts = useSelector(accountsSelector)

  const setAccount = address => {
    dispatch(setCurrentAccount({ chainId, address }))
    dispatch(setShowAccountMenu(false))
    history.push('/')
  }

  if (accounts.length <= 0) {
    return null
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
