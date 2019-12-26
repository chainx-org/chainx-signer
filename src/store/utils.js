import _ from 'lodash'

export function extractAccountInfo(account) {
  if (!account) {
    return
  }

  return _.pick(account, ['name', 'address'])
}
