import { createSelector, createSlice } from '@reduxjs/toolkit'
import { Extrinsic } from '../../shared/extensionExtrinsic'
import { stringCamelCase } from '@chainx/util'
import { Token, Address } from '@chainx/types'

const initialState = {
  version: 0,
  toSign: null
}

const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setToSign(state, { payload }) {
      state.toSign = payload
    },
    clearToSign(state) {
      // TODO: 切换网络是清掉toSign
      state.toSign = null
    }
  }
})

export const { setToSign, clearToSign } = txSlice.actions

export const toSignSelector = state => state.tx.toSign
export const toSignExtrinsicSelector = createSelector(
  toSignSelector,
  toSign => {
    if (!toSign) {
      return null
    }

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
