import { createAction, handleActions, Action } from 'redux-actions'

export const LOAD_DATA_START = 'PL/APP/LOAD_DATA/START'
export const LOAD_DATA_SUCCESS = 'PL/APP/LOAD_DATA/SUCCESS'
export const LOAD_DATA_FAIL = 'PL/APP/LOAD_DATA/FAIL'

export type LoadDataStartPayload = {
  id: string
}

export type LoadDataSuccessPayload = {}

export type LoadDataFailPayload = {}

const initialState: ReduxState.AppContainer = {
  mainControl: undefined,
  dataLoaded: false
}

export default handleActions({
  [LOAD_DATA_START]: (state: ReduxState.AppContainer, action: Action<LoadDataStartPayload>) => ({
    ...state
  }),
  [LOAD_DATA_SUCCESS]: (state: ReduxState.AppContainer, action: Action<LoadDataSuccessPayload>) => ({
    ...state,
    loaded: true
  }),
  [LOAD_DATA_FAIL]: (state: ReduxState.AppContainer, action: Action<LoadDataFailPayload>) => ({
    ...state,
    loaded: false
  })
}, initialState)

export const loadDataStart = createAction<LoadDataStartPayload>(LOAD_DATA_START)
export const loadDataSuccess = createAction<LoadDataSuccessPayload>(LOAD_DATA_SUCCESS)
export const loadDataFail = createAction<LoadDataFailPayload>(LOAD_DATA_FAIL)
