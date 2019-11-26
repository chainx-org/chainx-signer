import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

export default function createStore() {
  return configureStore({ reducer: rootReducer, })
}
