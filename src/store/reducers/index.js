import testReducer from './testSlice'
import account from './accountSlice'
import node from './nodeSlice'
import setting from './settingSlice'
import tx from './txSlice'
import statusReducer from './statusSlice'
import intentionSlice from './intentionSlice'
import tradeSlice from './tradeSlice'
import assetReducer from './assetSlice'
import chainx2Asset from './chainx2AssetSlice'

export default {
  assets: assetReducer,
  test: testReducer,
  status: statusReducer,
  intentions: intentionSlice,
  trade: tradeSlice,
  account,
  node,
  setting,
  tx,
  chainx2Asset
}
