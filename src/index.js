import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router } from 'react-router-dom'
import { chainSelector } from '@store/reducers/chainSlice'
import { CHAINS } from '@store/reducers/constants'
import { initChainxInstances } from '@store/reducers/nodeSlice'
import { initChainx2Instances } from '@store/reducers/chainx2NodeSlice'

const chain = chainSelector(store.getState())
if (CHAINS.chainx === chain) {
  initChainxInstances()
} else {
  initChainx2Instances()
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
