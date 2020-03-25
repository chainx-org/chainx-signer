import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router'
import Home from './Home'
import Header from './Header'
import CreateAccount from './CreateAccount'
import RequestSign from './RequestSign'
import ShowPrivateKey from './ShowPrivateKey/index'
import RemoveAccount from './RemoveAccount'
import NodeAction from './NodeAction'
import NodeError from './NodeAction/NodeError'
import { setChainx, sleep } from '../shared'
import spinner from '../assets/loading.gif'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAppVersion,
  setInitLoading,
  setLatestVersion,
  updateInfoSelector
} from '../store/reducers/statusSlice'
import { currentChainxNodeSelector } from '../store/reducers/nodeSlice'
import {
  handleApiResponse,
  handlePairedResponse,
  setService
} from '../services/socketService'
import ForceUpdateDialog from './ForceUpdateDialog'
import { fetchIntentions } from '../store/reducers/intentionSlice'
import {
  fetchAccountAssets,
  fetchAssetsInfo
} from '../store/reducers/assetSlice'
import { fetchTradePairs } from '../store/reducers/tradeSlice'
import { isTestNetSelector } from '../store/reducers/settingSlice'
import { currentAddressSelector } from '../store/reducers/accountSlice'
import { NewAccountDrawer } from './Drawers'
import ImportMnemonic from './ImportAccount/Mnemonic'
import ImportPrivateKey from './ImportAccount/PrivateKey'
import ImportKeystore from './ImportAccount/Keystore'

window.wallet.socketResponse = data => {
  if (typeof data === 'string') data = JSON.parse(data)
  switch (data.type) {
    case 'api':
      return handleApiResponse(data.request, data.id)
    case 'pair':
      return handlePairedResponse(data.request, data.id)
    default:
      return
  }
}

setService(window.sockets)

window.sockets.initialize().then(() => console.log('sockets initialized'))

const appVersion = window.require('electron').remote.app.getVersion()

export default function App() {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.status.loading)
  const initLoading = useSelector(state => state.status.initLoading)
  const { url: currentNodeUrl } = useSelector(currentChainxNodeSelector) || {}
  const state = useSelector(state => state)
  const isTestNet = useSelector(isTestNetSelector)
  const address = useSelector(currentAddressSelector)

  if (process.env.NODE_ENV === 'development') {
    console.log('state', state)
  }

  const history = useHistory()
  const toSign = useSelector(state => state.tx.toSign)

  useEffect(() => {
    try {
      if (toSign) {
        history.push({
          pathname: '/requestSign'
        })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    }
  }, [toSign, history])

  useEffect(() => {
    dispatch(setAppVersion(appVersion))
    window.fetchLatestVersion().then(latestVersion => {
      dispatch(setLatestVersion(latestVersion))
    })
  }, [dispatch])

  useEffect(() => {
    Promise.race([setChainx(currentNodeUrl), sleep(10000)])
      .then(chainx => {
        if (!chainx) {
          history.push('/nodeError')
        } else if (history.location.pathname === '/nodeError') {
          history.push('/')
        }
      })
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`)
      })
      .finally(() => {
        dispatch(setInitLoading(false))
      })
  }, [currentNodeUrl, dispatch, history])

  useEffect(() => {
    dispatch(fetchIntentions())
    dispatch(fetchAssetsInfo())
    dispatch(fetchTradePairs())
  }, [isTestNet, dispatch])

  useEffect(() => {
    if (address) {
      dispatch(fetchAccountAssets(address))
    }
  }, [dispatch, address])

  const updateInfo = useSelector(updateInfoSelector)

  return (
    <React.Fragment>
      <Header props />
      {do {
        if (updateInfo.hasNewVersion && updateInfo?.versionInfo?.forceUpdate) {
          // eslint-disable-next-line no-unused-expressions
          ;<ForceUpdateDialog />
        }
      }}
      {do {
        if (loading || initLoading) {
          // eslint-disable-next-line no-unused-expressions
          ;<div className="spinner">
            <img src={spinner} alt="spinner" />
          </div>
        } else if (!initLoading) {
          // eslint-disable-next-line no-unused-expressions
          ;<div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/createAccount" component={CreateAccount} />
              <Route path="/importMnemonic" component={ImportMnemonic} />
              <Route path="/importPrivateKey" component={ImportPrivateKey} />
              <Route path="/importKeystore" component={ImportKeystore} />
              <Route path="/requestSign" component={RequestSign} />
              <Route path="/showPrivateKey" component={ShowPrivateKey} />
              <Route path="/removeAccount" component={RemoveAccount} />
              <Route path="/addNode" component={NodeAction} />
              <Route path="/nodeError" component={NodeError} />
              <Redirect to="/" />
            </Switch>
          </div>
        }
      }}
      <NewAccountDrawer />
    </React.Fragment>
  )
}
