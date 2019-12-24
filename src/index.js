import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import { Provider } from 'react-redux'
import createStore from './store'

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
