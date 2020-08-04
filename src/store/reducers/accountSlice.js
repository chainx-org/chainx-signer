import { createSelector, createSlice } from '@reduxjs/toolkit'
import {
  ACCOUNT_STORE_KEY,
  CHAINX2_TEST,
  CHAINX_MAIN,
  CHAINX_TEST,
  events
} from './constants'
import { chainxNetwork, networkSelector } from './settingSlice'
import { extractAccountInfo } from '../utils'
import _ from 'lodash'

const defaultAccountInitialState = {
  version: 1,
  chainxMainNetAccounts: [],
  currentChainXMainNetAccount: null,
  chainxTestNetAccounts: [],
  currentChainxTestNetAccount: null,
  chainx2TestNetAccounts: [],
  currentChainx2TestNetAccount: null
}

let initialState = do {
  const storedState = window.accountStore.get(ACCOUNT_STORE_KEY)
  if (!storedState) {
    // eslint-disable-next-line no-unused-expressions
    defaultAccountInitialState
  } else if (storedState.version < 1) {
    // eslint-disable-next-line no-unused-expressions
    ;({
      ...defaultAccountInitialState,
      ..._.pick(storedState, [
        'chainxMainNetAccounts',
        'currentChainXMainNetAccount',
        'chainxTestNetAccounts',
        'currentChainxTestNetAccount'
      ])
    })
  } else {
    // eslint-disable-next-line no-unused-expressions
    storedState
  }
}

function findTargetAccounts(state, chainId) {
  let targetAccounts
  if (CHAINX_MAIN === chainId) {
    targetAccounts = state.chainxMainNetAccounts
  } else if (CHAINX_TEST === chainId) {
    targetAccounts = state.chainxTestNetAccounts
  } else if (CHAINX2_TEST === chainId) {
    targetAccounts = state.chainx2TestNetAccounts
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
      } else if (CHAINX2_TEST === chainId) {
        pre = state.currentChainx2TestNetAccount
        state.currentChainx2TestNetAccount = account
      }
      window.accountStore.set(ACCOUNT_STORE_KEY, state)

      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(account)
      })
    },
    setCurrentAccount(state, { payload: { chainId, address } }) {
      const targetAccounts = findTargetAccounts(state, chainId)
      const target = targetAccounts.find(a => a.address === address)
      if (!target) {
        throw new Error(`No ${chainId} account found with address ${address}`)
      }

      let pre
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetAccount
        state.currentChainXMainNetAccount = target
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainxTestNetAccount
        state.currentChainxTestNetAccount = target
      } else if (CHAINX2_TEST === chainId) {
        pre = state.currentChainx2TestNetAccount
        state.currentChainx2TestNetAccount = target
      }

      window.accountStore.set(ACCOUNT_STORE_KEY, state)

      window.sockets.broadcastEvent(events.ACCOUNT_CHANGE, {
        from: extractAccountInfo(pre),
        to: extractAccountInfo(target)
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
      let pre
      if (chainId === CHAINX_MAIN) {
        pre = state.currentChainXMainNetAccount
        state.currentChainXMainNetAccount = targetAccounts[0] || null
      } else if (chainId === CHAINX_TEST) {
        pre = state.currentChainxTestNetAccount
        state.currentChainxTestNetAccount = targetAccounts[0] || null
      } else if (chainId === CHAINX2_TEST) {
        pre = state.currentChainx2TestNetAccount
        state.currentChainx2TestNetAccount = targetAccounts[0] || null
      }
      const current = targetAccounts[0] || null

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
  setCurrentAccount,
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
export const chainx2TestNetAccountsSelector = state =>
  state.account.chainx2TestNetAccounts
export const currentChainx2TestNetAccountSelector = state =>
  state.account.currentChainx2TestNetAccount

export const accountsSelector = createSelector(
  networkSelector,
  chainxMainNetAccountsSelector,
  chainxTestNetAccountsSelector,
  chainx2TestNetAccountsSelector,
  (network, mainNetAccounts, testNetAccounts, chainx2TestNetAcconts) => {
    if (network === chainxNetwork.TEST) {
      return testNetAccounts
    } else if (network === chainxNetwork.MAIN) {
      return mainNetAccounts
    } else if (network === CHAINX2_TEST) {
      return chainx2TestNetAcconts
    }
  }
)

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

export const currentAccountSelector = createSelector(
  networkSelector,
  currentChainXMainNetAccountSelector,
  currentChainxTestNetAccountSelector,
  currentChainx2TestNetAccountSelector,
  (network, mainNetAccount, testNetAccount, chainx2TestNetAccount) => {
    if (network === chainxNetwork.TEST) {
      return testNetAccount
    } else if (network === chainxNetwork.MAIN) {
      return mainNetAccount
    } else if (network === CHAINX2_TEST) {
      return chainx2TestNetAccount
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

export const currentAddressSelector = createSelector(
  currentChainxAccountSelector,
  account => {
    return account ? account.address : null
  }
)

export default accountSlice.reducer
