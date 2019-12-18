export const CHAINX_MAIN = 'chainx-mainnet'
export const CHAINX_TEST = 'chainx-testnet'
export const ACCOUNT_STORE_KEY = 'accounts'
export const NODE_STORE_KEY = 'nodes'

export const defaultAccountInitialState = {
  version: 0,
  chainxMainNetAccounts: [],
  chainxTestNetAccounts: []
}

export const defaultNodeInitialState = {
  version: 0,
  chainxMainNetNodes: [],
  chainxTestNetNodes: []
}
