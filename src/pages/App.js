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
  setInitLoading,
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
import { paths } from '../constants'
import ExportKeystore from './ExportKeystore'
import RemoveNode from './NodeAction/RemoveNode'
import styled from 'styled-components'
import useListenSignRequest from '../hooks/useListenSignRequest'
import useCheckVersion from '../hooks/useCheckVersion'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`

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

  useListenSignRequest()
  useCheckVersion()

  useEffect(() => {
    Promise.race([setChainx(currentNodeUrl), sleep(10000)])
      .then(chainx => {
        if (!chainx) {
          history.push(paths.nodeError)
        } else if (history.location.pathname === paths.nodeError) {
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
      <Header />
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
          ;<Wrapper>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/createAccount" component={CreateAccount} />
              <Route path="/importMnemonic" component={ImportMnemonic} />
              <Route path="/importPrivateKey" component={ImportPrivateKey} />
              <Route path="/importKeystore" component={ImportKeystore} />
              <Route path="/requestSign" component={RequestSign} />
              <Route path={paths.showPrivateKey} component={ShowPrivateKey} />
              <Route path={paths.removeAccount} component={RemoveAccount} />
              <Route path={paths.addNode} component={NodeAction} />
              <Route path={paths.removeNode} component={RemoveNode} />
              <Route path={paths.nodeError} component={NodeError} />
              <Route path={paths.exportKeystore} component={ExportKeystore} />
              <Redirect to="/" />
            </Switch>
          </Wrapper>
        }
      }}
      <NewAccountDrawer />
    </React.Fragment>
  )
}
