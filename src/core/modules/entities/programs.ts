import {Action, createAction, handleActions} from 'redux-actions'

export const SET = 'PL/PROGRAMS/SET'
export const DELETE = 'PL/PROGRAMS/DELETE'
export const EDIT = 'PL/PROGRAMS/EDIT'

export type SetProgramsPayload = {
  programs: ServerEntity.Program[]
}

export type DeleteProgramPayload = {
  index: number
}

export type EditProgramPayload = {
  program: ServerEntity.Program
  index: number
}

const initialState: ReduxState.Programs = []

export default handleActions({
  [DELETE]: (state: ReduxState.Programs, action: Action<DeleteProgramPayload>) => {
    let programsCopy = state.slice()
    programsCopy.splice(action.payload.index, 1)
    return programsCopy
  },
  [EDIT]: (state: ReduxState.Programs, action: Action<EditProgramPayload>) => {
    let programsCopy = state.slice()
    programsCopy[action.payload.index] = action.payload.program
    return programsCopy
  },
  [SET]: (state: ReduxState.Programs, action: Action<SetProgramsPayload>) => {
    let programsCopy = state.slice()
    action.payload.programs.map((p: ServerEntity.Program) => {
      programsCopy.push(p)
    })
    return programsCopy
  }
}, initialState)

export const setPrograms = createAction<SetProgramsPayload>(SET)
export const deleteProgram = createAction<DeleteProgramPayload>(DELETE)
export const editProgram = createAction<EditProgramPayload>(EDIT)
