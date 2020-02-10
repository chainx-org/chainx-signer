import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Header from './Header'
import CreateAccount from './CreateAccount'
import ImportAccount from './ImportAccount'
import RequestSign from './RequestSign'
import ShowPrivateKey from './ShowPrivateKey/index'
import EnterPassword from './EnterPassword'
import NodeAction from './NodeAction'
import NodeError from './NodeAction/NodeError'
import { setChainx, sleep } from '../shared'
import spinner from '../assets/loading.gif'
import './index.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setInitLoading } from '../store/reducers/statusSlice'
import { currentChainxNodeSelector } from '../store/reducers/nodeSlice'

import {
  handleApiResponse,
  handlePairedResponse,
  setService
} from '../services/socketService'

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
  let redirectUrl = '/'

  const dispatch = useDispatch()
  const loading = useSelector(state => state.status.loading)
  const initLoading = useSelector(state => state.status.initLoading)
  const currentNode = useSelector(currentChainxNodeSelector)
  const state = useSelector(state => state)

  if (process.env.NODE_ENV === 'development') {
    console.log('state', state)
  }

  useEffect(() => {
    getSetting()
    // eslint-disable-next-line
  }, [])

  const getSetting = async () => {
    Promise.race([setChainx(currentNode.url), sleep(3000)])
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`)
      })
      .finally(() => {
        dispatch(setInitLoading(false))
      })
  }

  return (
    <Router>
      <React.Fragment>
        <Header props />
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
                <Route path="/importAccount" component={ImportAccount} />
                <Route path="/requestSign/:id?" component={RequestSign} />
                <Route path="/showPrivateKey" component={ShowPrivateKey} />
                <Route path="/enterPassword" component={EnterPassword} />
                <Route path="/addNode" component={NodeAction} />
                <Route path="/nodeError" component={NodeError} />
                <Redirect to={redirectUrl} />
              </Switch>
            </div>
          }
        }}
      </React.Fragment>
    </Router>
  )
}
