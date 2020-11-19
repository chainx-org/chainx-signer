import { Keyring } from '@polkadot/keyring'
export const nonFunc = () => {}

const keystoreV1Keys = ['address', 'tag', 'encoded', 'net']

const keystoreV0Keys = ['iv', 'mac', 'salt', 'ciphertext', 'iterations']

export const isKeystoreV1 = (keystoreObject = {}) => {
  const keys = Object.keys(keystoreObject)
  return keystoreV1Keys.every(key => keys.includes(key))
}

export const isKeystoreKeysRight = (keystoreObject = {}) => {
  const keys = Object.keys(keystoreObject)

  return (
    keystoreV0Keys.every(key => keys.includes(key)) ||
    keystoreV1Keys.every(key => keys.includes(key))
  )
}

export const KeyStoreV2Encrypt = (account, password) => {
  const keyring = new Keyring({ type: 'ed25519', ss58Format: 44 })

  const result = keyring.addFromUri(account, { name: 'chainx-v2' }, 'ed25519')

  const keystore = new Blob([JSON.stringify(result.toJson(password))], {
    type: 'application/json; charset=utf-8'
  })
  return keystore
}
