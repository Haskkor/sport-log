import {Action, createAction, handleActions} from 'redux-actions'

export const SET = 'PL/QUICK_LOG/SET'
export const DELETE = 'PL/QUICK_LOG/DELETE'
export const EDIT = 'PL/QUICK_LOG/EDIT'
export const RESET = 'PL/QUICK_LOG/RESET'

export type SetQuickLogPayload = {
  sets: ServerEntity.ExerciseSet[]
}

export type DeleteQuickLogPayload = {
  index: number
}

export type EditQuickLogPayload = {
  index: number
  set: ServerEntity.ExerciseSet
}

export type ResetQuickLogPayload = {}

const initialState: ReduxState.QuickLog = []

export default handleActions({
  [DELETE]: (state: ReduxState.QuickLog, action: Action<DeleteQuickLogPayload>) => {
    let quickLogCopy = state.slice()
    quickLogCopy.splice(action.payload.index, 1)
    return quickLogCopy
  },
  [SET]: (state: ReduxState.QuickLog, action: Action<SetQuickLogPayload>) => {
    let quickLogCopy = state.slice()
    action.payload.sets.map((s: ServerEntity.ExerciseSet) => quickLogCopy.push(s))
    return quickLogCopy
  },
  [EDIT]: (state: ReduxState.QuickLog, action: Action<EditQuickLogPayload>) => {
    let quickLogCopy = state.slice()
    quickLogCopy[action.payload.index] = action.payload.set
    return quickLogCopy
  },
  [RESET]: (state: ReduxState.QuickLog, action: Action<ResetQuickLogPayload>) => {
    return []
  }
}, initialState)

export const setQuickLog = createAction<SetQuickLogPayload>(SET)
export const deleteQuickLog = createAction<DeleteQuickLogPayload>(DELETE)
export const editQuickLog = createAction<EditQuickLogPayload>(EDIT)
export const resetQuickLog = createAction<ResetQuickLogPayload>(RESET)
