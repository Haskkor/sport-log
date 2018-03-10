import { applyMiddleware, compose, createStore as _createStore, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import normailzrMiddleware from './middlewares/NormalizrMiddleware'
import rootSaga from './saga'
import reducer from './modules/reducer'

export default function createStore (data?: any): Store<any> {
  const sagaMiddleware = createSagaMiddleware()

  const middleware = [sagaMiddleware, normailzrMiddleware]

  const devToolsExtension = (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f

  const finalCreateStore = compose<any>(applyMiddleware(...middleware), devToolsExtension)(_createStore)

  const store = finalCreateStore(reducer, data)

  sagaMiddleware.run(rootSaga)

  return store
}
