import {
  setShowAccountMenu,
  setShowImportMenu
} from '../../store/reducers/statusSlice'
import Icon from '../../components/Icon'
import Accounts from './Accounts'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chainxAccountsSelector } from '../../store/reducers/accountSlice'

export default function({ history }) {
  const dispatch = useDispatch()
  const accounts = useSelector(chainxAccountsSelector)

  return (
    <div className="account-area">
      <div className="action">
        <div
          onClick={() => {
            dispatch(setShowAccountMenu(false))
            dispatch(setShowImportMenu(true))
          }}
        >
          <Icon name="Putin" className="account-area-icon" />
          <span>Import</span>
        </div>
        <div
          onClick={() => {
            dispatch(setShowAccountMenu(false))
            history.push('/createAccount')
          }}
        >
          <Icon name="Add" className="account-area-icon" />
          <span>New</span>
        </div>
      </div>
      {accounts.length > 0 && <Accounts history={history} />}
    </div>
  )
}
