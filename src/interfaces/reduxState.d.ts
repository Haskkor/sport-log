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
  }

  type Programs = ServerEntity.Program[]

  type History = {
    dataLoaded: boolean
    data: ServerEntity.History
    currentTimestamp: number
  }
}
