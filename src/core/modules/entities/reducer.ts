import { combineReducers } from 'redux'
import * as _ from 'lodash'
import programs from './programs'
import history from './history'
import quicklog from './quicklog'

const initialState = {}

const subReducers = combineReducers({
  quicklog,
  programs,
  history
})

export default function reducer (state = initialState, action: any) { // fixme any
  const entities = _.result(action, 'payload.normalized.entities')
  if (entities) {
    const newState: any = _.assign({}, state) // fixme any
    _.forOwn(entities, (items, key) => {
      newState[key] = {...newState[key], ...items}
    })
    return newState
  }
  return subReducers(state, action)
}
