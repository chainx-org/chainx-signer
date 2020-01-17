export const xAssetsProcessCalls = ['withdraw', 'revokeWithdraw']

export const nominateMethodNames = ['nominate', 'renominate', 'unnominate']

// 一定属于staking模块的方法名
export const stakingMethodNames = [
  ...nominateMethodNames,
  'unfreeze',
  'register'
]
