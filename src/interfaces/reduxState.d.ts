declare namespace ReduxState {
  type RootState = {
    session: Session
    container: {
      App: AppContainer
    }
    entities: Entities
  }

  type AppContainer = {}

  type Session = {}

  type Entities = {
    programs: Programs
    history: History
    quicklog: QuickLog
  }

  type Programs = ServerEntity.Program[]

  type QuickLog = ServerEntity.ExerciseSet[]

  type History = {
    dataLoaded: boolean
    data: ServerEntity.History
    currentTimestamp: number
    quickLogHistory: ServerEntity.HistoryDate
  }
}
