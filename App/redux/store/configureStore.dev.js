import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import rootReducer from '../reducers/index'
import rootSaga from '../sagas'

const configureStore = (preloadedState) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware, logger),
  )

  sagaMiddleware.run(rootSaga)

  return store
}

export default configureStore
