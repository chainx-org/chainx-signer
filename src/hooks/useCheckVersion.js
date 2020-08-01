import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setAppVersion, setLatestVersion } from '../store/reducers/statusSlice'

export default function useCheckVersion() {
  const dispatch = useDispatch()

  useEffect(() => {
    const appVersion = window.require('electron').remote.app.getVersion()
    dispatch(setAppVersion(appVersion))
    window.fetchLatestVersion().then(latestVersion => {
      dispatch(setLatestVersion(latestVersion))
    })
  }, [dispatch])
}
