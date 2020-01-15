import { createSlice, createSelector } from '@reduxjs/toolkit'
import {
  ACCOUNT_STORE_KEY,
  CHAINX_MAIN,
  CHAINX_TEST,
  events
} from './constants'
import { chainxNetwork, networkSelector } from './settingSlice'
import { extractAccountInfo } from '../utils'

const defaultAccountInitialState = {
  version: 0,
  chainxMainNetAccounts: [],
  currentChainXMainNetAccount: null,
  chainxTestNetAccounts: [],
  currentChainxTestNetAccount: null
}

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
    addAccount(
      state,
      {
        payload: {
          chainId,
          account: { name, address, keystore }
        }
      }
    ) {
      const targetAccounts = findTargetAccounts(state, chainId)

      if (targetAccounts.findIndex(a => a.name === name) >= 0) {
        return
      }

      const account = { name, address, keystore }
      const index = targetAccounts.findIndex(a => a.address === address)
      if (index >= 0) {
        targetAccounts.splice(index, 1, account)
      } else {
        targetAccounts.push(account)
      }

      let pre
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetAccount
        state.currentChainXMainNetAccount = account
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainxTestNetAccount
        state.currentChainxTestNetAccount = account
      }
      window.accountStore.set(ACCOUNT_STORE_KEY, state)

      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(account)
      })
    },
    setCurrentChainXMainNetAccount(state, { payload: { address } }) {
      const target = state.chainxMainNetAccounts.find(
        a => a.address === address
      )
      if (!target) {
        throw new Error(`No ChainX mainnet account with address ${address}`)
      }

      const pre = state.currentChainXMainNetAccount
      state.currentChainXMainNetAccount = target
      window.accountStore.set(ACCOUNT_STORE_KEY, state)
      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(target)
      })
    },
    removeAccount(state, { payload: { chainId, address } }) {
      const targetAccounts = findTargetAccounts(state, chainId)

      const index = targetAccounts.findIndex(a => a.address === address)
      if (index < 0) {
        return
      }

      targetAccounts.splice(index, 1)
      let pre, current
      if (chainId === CHAINX_MAIN) {
        pre = state.currentChainXMainNetAccount
        state.currentChainXMainNetAccount = targetAccounts[0] || null
        current = targetAccounts[0] || null
      } else if (chainId === CHAINX_TEST) {
        pre = state.currentChainxTestNetAccount
        state.currentChainxTestNetAccount = targetAccounts[0] || null
        current = targetAccounts[0] || null
      }

      window.accountStore.set(ACCOUNT_STORE_KEY, state)
      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(current)
      })

      // TODO: 处理不存在address的情况
    },
    setCurrentChainXTestNetAccount(state, { payload: { address } }) {
      const target = state.chainxTestNetAccounts.find(
        a => a.address === address
      )
      if (!target) {
        throw new Error(`No ChainX testnet account with address ${address}`)
      }

      const pre = state.currentChainXMainNetAccount
      state.currentChainxTestNetAccount = target
      window.accountStore.set(ACCOUNT_STORE_KEY, state)
      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(target)
      })
    }
  }
})

export const {
  addAccount,
  removeAccount,
  setCurrentChainXMainNetAccount,
  setCurrentChainXTestNetAccount
} = accountSlice.actions

export const chainxMainNetAccountsSelector = state =>
  state.account.chainxMainNetAccounts
export const chainxTestNetAccountsSelector = state =>
  state.account.chainxTestNetAccounts
export const currentChainXMainNetAccountSelector = state =>
  state.account.currentChainXMainNetAccount
export const currentChainxTestNetAccountSelector = state =>
  state.account.currentChainxTestNetAccount

export const chainxAccountsSelector = createSelector(
  networkSelector,
  chainxMainNetAccountsSelector,
  chainxTestNetAccountsSelector,
  (network, mainNetAccounts, testNetAccounts) => {
    if (network === chainxNetwork.TEST) {
      return testNetAccounts
    } else if (network === chainxNetwork.MAIN) {
      return mainNetAccounts
    }
  }
)

export const currentChainxAccountSelector = createSelector(
  networkSelector,
  currentChainXMainNetAccountSelector,
  currentChainxTestNetAccountSelector,
  (network, mainNetAccount, testNetAccount) => {
    if (network === chainxNetwork.TEST) {
      return testNetAccount
    } else if (network === chainxNetwork.MAIN) {
      return mainNetAccount
    }
  }
)

export default accountSlice.reducer
