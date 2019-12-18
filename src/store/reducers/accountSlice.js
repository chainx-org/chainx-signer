import { createSlice } from '@reduxjs/toolkit'
import {
  ACCOUNT_STORE_KEY,
  CHAINX_MAIN,
  CHAINX_TEST,
  defaultAccountInitialState
} from './constants'

let initialState =
  window.accountStore.get(ACCOUNT_STORE_KEY) || defaultAccountInitialState

function findTargetAccounts(state, chainId) {
  let targetAccounts
  if (CHAINX_MAIN === chainId) {
    targetAccounts = state.chainxMainNetAccounts
  } else if (CHAINX_TEST === chainId) {
    targetAccounts = state.chainxTestNetAccounts
  } else {
    throw new Error(`Invalid chainId: ${chainId}`)
  }

  return targetAccounts
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addAccount(state, { chainId, account: { name, address, keystore } }) {
      const targetAccounts = findTargetAccounts(state, chainId)

      if (targetAccounts.findIndex(a => a.address === address) < 0) {
        targetAccounts.push({ name, address, keystore })
        window.accountStore.set(ACCOUNT_STORE_KEY, state)
      }

      // TODO: 处理存在相同address的情况
    },
    removeAccount(state, { chainId, address }) {
      const targetAccounts = findTargetAccounts(state, chainId)

      const index = targetAccounts.findIndex(a => a.address === address)
      if (index >= 0) {
        targetAccounts.splice(index, 1)
        window.accountStore.set(ACCOUNT_STORE_KEY, state)
      }

      // TODO: 处理不存在address的情况
    }
  }
})

export const { addAccount, removeAccount } = accountSlice.actions

export default accountSlice.reducer
