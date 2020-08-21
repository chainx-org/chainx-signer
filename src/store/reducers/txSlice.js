import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Extrinsic } from '../../shared/extensionExtrinsic'
import { stringCamelCase } from '@chainx/util'
import { Token, Address } from '@chainx/types'
import { isTestNetSelector } from './settingSlice'
import { Account } from 'chainx.js'
import { CHAINX2_TEST } from '@store/reducers/constants'

const initialState = {
  version: 0,
  toSign: null,
  chainx2ToSign: null
}

const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setToSign(state, { payload }) {
      const { chainId } = payload

      if ([CHAINX2_TEST].includes(chainId)) {
        state.chainx2ToSign = payload
      } else {
        state.toSign = payload
      }
    },
    setChainx2ToSign(state, { payload }) {
      state.chainx2ToSign = payload
    },
    clearToSign(state) {
      state.toSign = null
    },
    clearChainx2ToSign(state) {
      state.chainx2ToSign = null
    }
  }
})

export const {
  setToSign,
  clearToSign,
  setChainx2ToSign,
  clearChainx2ToSign
} = txSlice.actions

export const chainx2ToSignSelector = state => state.tx.chainx2ToSign
export const chainx2ToSignParamsSelector = createSelector(
  chainx2ToSignSelector,
  toSign => {
    return toSign ? toSign.data.params : null
  }
)

export const toSignSelector = state => state.tx.toSign
export const toSignExtrinsicSelector = createSelector(
  toSignSelector,
  isTestNetSelector,
  (toSign, isTestNet) => {
    if (!toSign) {
      return null
    }

    Account.setNet(isTestNet ? 'testnet' : 'mainnet')
    return new Extrinsic(toSign.data)
  }
)

export const toSignMethodNameSelector = createSelector(
  toSignExtrinsicSelector,
  extrinsic => {
    return extrinsic ? stringCamelCase(extrinsic.methodName) : null
  }
)

export const toSignArgsSelector = createSelector(
  toSignExtrinsicSelector,
  extrinsic => {
    if (!extrinsic) {
      return []
    }

    return extrinsic.argsArr.map(item =>
      extrinsic.methodName === 'put_code' ? item.value : item.value.toString()
    )
  }
)

export const isPseduClaimSelector = createSelector(
  toSignExtrinsicSelector,
  ex => {
    if (!ex || ex.methodName !== 'claim' || ex.argsArr.length !== 1) {
      return false
    }

    return ex.argsArr[0].value instanceof Token
  }
)

export const isStakingClaimSelector = createSelector(
  toSignExtrinsicSelector,
  ex => {
    if (!ex || ex.methodName !== 'claim' || ex.argsArr.length !== 1) {
      return false
    }

    return ex.argsArr[0].value instanceof Address
  }
)

export default txSlice.reducer
