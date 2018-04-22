import { createAction, handleActions, Action } from 'redux-actions'

export const LOAD_HISTORY_START = 'PL/LOAD_HISTORY/START'
export const LOAD_HISTORY_SUCCESS = 'PL/LOAD_HISTORY/SUCCESS'
export const LOAD_HISTORY_FAIL = 'PL/LOAD_HISTORY/FAIL'
export const SAVE_QUICK_LOG_HISTORY = 'PL/SAVE_QUICK_LOG_HISTORY'

export type LoadHistoryStartPayload = {
  currentTimestamp: number
}
export type LoadHistorySuccessPayload = {
  data: ServerEntity.History
}
export type LoadHistoryFailPayload = {}

export type SaveQuickLogHistoryPayload = {
  quickLogHistory: ServerEntity.HistoryDate
}

const initialState: ReduxState.History = {
  dataLoaded: false,
  currentTimestamp: 0,
  data: [],
  quickLogHistory: {} as ServerEntity.HistoryDate
}

export default handleActions({
  [LOAD_HISTORY_START]: (state: ReduxState.History, action: Action<LoadHistoryStartPayload>) => ({
    ...state,
    currentTimestamp: action.payload.currentTimestamp
  }),
  [LOAD_HISTORY_SUCCESS]: (state: ReduxState.History, action: Action<LoadHistorySuccessPayload>) => ({
    ...state,
    data: action.payload.data,
    dataLoaded: true
  }),
  [LOAD_HISTORY_FAIL]: (state: ReduxState.History, action: Action<LoadHistoryFailPayload>) => ({
    ...state,
    dataLoaded: false
  }),
  [SAVE_QUICK_LOG_HISTORY]: (state: ReduxState.History, action: Action<SaveQuickLogHistoryPayload>) => ({
    ...state,
    quickLogHistory: action.payload.quickLogHistory
  })
}, initialState)

export const loadHistoryStart = createAction<LoadHistoryStartPayload>(LOAD_HISTORY_START)
export const loadHistorySuccess = createAction<LoadHistoryFailPayload>(LOAD_HISTORY_SUCCESS)
export const loadHistoryFail = createAction<LoadHistoryFailPayload>(LOAD_HISTORY_FAIL)
export const saveQuickLogHistory = createAction<SaveQuickLogHistoryPayload>(SAVE_QUICK_LOG_HISTORY)
