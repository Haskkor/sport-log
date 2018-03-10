import { combineReducers } from 'redux'
import container from './container/reducer'
import entities from './entities/reducer'

export default combineReducers({
  container,
  entities
})
