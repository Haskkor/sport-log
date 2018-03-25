import { createAction, handleActions, Action } from 'redux-actions'

export const LOAD_HISTORY_START = 'PL/LOAD_HISTORY/START'
export const LOAD_HISTORY_SUCCESS = 'PL/LOAD_HISTORY/SUCCESS'
export const LOAD_HISTORY_FAIL = 'PL/LOAD_HISTORY/FAIL'

export type LoadHistoryStartPayload = {}
export type LoadHistorySuccessPayload = {
  data: ServerEntity.History
}
export type LoadHistoryFailPayload = {}

const initialState: ReduxState.History = {
  dataLoaded: false,
  data: {}
}

export default handleActions({
  [LOAD_HISTORY_START]: (state: ReduxState.AppContainer, action: Action<LoadHistoryStartPayload>) => ({
    ...state
  }),
  [LOAD_HISTORY_SUCCESS]: (state: ReduxState.AppContainer, action: Action<LoadHistorySuccessPayload>) => ({
    ...state,
    data: action.payload.data,
    dataLoaded: true
  }),
  [LOAD_HISTORY_FAIL]: (state: ReduxState.AppContainer, action: Action<LoadHistoryFailPayload>) => ({
    ...state,
    dataLoaded: false
  })
}, initialState)

export const loadHistoryStart = createAction<LoadHistoryStartPayload>(LOAD_HISTORY_START)
export const loadHistorySuccess = createAction<LoadHistoryFailPayload>(LOAD_HISTORY_SUCCESS)
export const loadHistoryFail = createAction<LoadHistoryFailPayload>(LOAD_HISTORY_FAIL)
