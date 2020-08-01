import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Header from './Header'
import CreateAccount from './CreateAccount'
import RequestSign from './RequestSign'
import ShowPrivateKey from './ShowPrivateKey/index'
import RemoveAccount from './RemoveAccount'
import NodeAction from './NodeAction'
import NodeError from './NodeAction/NodeError'
import spinner from '../assets/loading.gif'
import './index.scss'
import { useSelector } from 'react-redux'
import { updateInfoSelector } from '../store/reducers/statusSlice'
import {
  handleApiResponse,
  handlePairedResponse,
  setService
} from '../services/socketService'
import ForceUpdateDialog from './ForceUpdateDialog'
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
import useFetchBasicInfo from '../hooks/useFetchBasicInfo'
import useFetchChainxAssets from '../hooks/useFetchChainxAssets'
import useInitChainx from '../hooks/useInitChainx'

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
  const loading = useSelector(state => state.status.loading)
  const initLoading = useSelector(state => state.status.initLoading)
  const state = useSelector(state => state)

  if (process.env.NODE_ENV === 'development') {
    console.log('state', state)
  }

  useListenSignRequest()
  useCheckVersion()
  useInitChainx()
  useFetchBasicInfo()
  useFetchChainxAssets()

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
