import { clearChainx2ToSign } from '@store/reducers/txSlice'

export const removeCurrentSign = (dispatch, history) => {
  try {
    dispatch(clearChainx2ToSign())
  } catch (e) {
    console.log(e)
    // window.close()
  } finally {
    history.push('/')
  }
}

export const getToken = (id, assetsInfo = []) => {
  if (String(id) === '0') {
    return 'PCX'
  }

  return assetsInfo.find(a => a.id === String(id))?.info?.token
}
