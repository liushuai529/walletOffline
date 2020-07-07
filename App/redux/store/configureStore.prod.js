import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/index'
import rootSaga from '../sagas'

const configureStore = (preloadedState) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware),
  )

  sagaMiddleware.run(rootSaga)

  return store
}

export default configureStore
