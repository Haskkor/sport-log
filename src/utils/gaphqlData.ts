export type dataHistoryDateUser = {
  error: any,
  fetchMore: () => void
  historyDateUser: {
    __typename: string
    _id: string
    _userId: string
    exercises: {
      __typename: string
      done: boolean
      exercise: {
        __typename: string
        equipment: string
        name: string
      }
      muscleGroup: string
      recoveryTime: string
      sets: {
        __typename: string
        reps: number
        weight: number
      }[]
    }[]
    timestamp: string
  }
  loading: boolean
  networkStatus: number
  refetch: () => void
  startPolling: () => void
  stopPolling: () => void
  subscribeToMore: () => void
  updateQuery: () => void
  variables: {}
}

export type dataCreateHistoryDate = {
  createHistoryDate: {
    __typename: string
    _id: string
    _userid: string
    exercises: {
      __typename: string
      done: boolean
      exercise: {
        __typename: string
        equipment: string
        name: string
      }
      muscleGroup: string
      recoveryTime: string
      sets: {
        __typename: string
        reps: number
        weight: number
      }[]
    }[]
    timestamp: string
  }
}

export type dataCreateProgram = {
  createProgram: {
    __typename: string
    _id: string
  }
}

export type dataSignUp = {
  signup: {
    __typename: string,
    _id: string,
    email: string,
    jwt: string
  }
}

export type dataProgram = {
  __typename: string
  _id: string
  _userId: string
  active: boolean
  days: {
    __typename: string
    day: string
    exercises: {
      __typename: string
      exercise: {
        __typename: string
        equipment: string
        name: string
      }
      muscleGroup: string
      recoveryTime: string
      sets: {
        reps: number
        weight: number
      }[]
    }[]
    isCollapsed: boolean
    isDayOff: boolean
  }[]
  name: string
}