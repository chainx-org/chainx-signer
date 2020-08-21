export const methods = {
  getAccount: 'chainx_account',
  getSettings: 'get_settings',
  signChainxExtrinsic: 'chainx_sign',
  signChainx2Extrinsic: 'chainx2_sign',
  signAndSendChainXExtrinsic: 'chainx_sign_send',
  signAndSendChainX2Extrinsic: 'chainx2_sign_send',
  getNode: 'chainx_get_node'
}

export const token = {
  BTC: 'BTC',
  XBTC: 'XBTC',
  LBTC: 'L-BTC',
  SDOT: 'SDOT',
  PCX: 'PCX'
}

export const paths = {
  removeAccount: '/removeAccount',
  showPrivateKey: '/showPrivateKey',
  exportKeystore: '/exportKeystore',
  nodeError: '/nodeError',
  home: '/',
  removeNode: '/removeNode',
  addNode: '/addNode',
  chainxSign: '/requestSign',
  chainx2Sign: '/requestChainx2Sign'
}
