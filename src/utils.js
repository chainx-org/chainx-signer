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
