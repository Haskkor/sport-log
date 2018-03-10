declare namespace ReduxState {
  type RootState = {
    session: Session,
    container: {
      App: AppContainer
    }
    entities: Entities
  }

  type AppContainer = {}

  type Session = {}

  type Entities = {
    programs: Programs
  }

  type Programs = ServerEntity.Program[]
}
