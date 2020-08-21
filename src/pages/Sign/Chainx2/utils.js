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
