declare namespace ServerEntity {

  type Program = {
    name: string
    active: boolean
    _id?: string
    days: ExercisesDay[]
  }

  type ExercisesDay = {
    day: string
    exercises: ExerciseSet[]
    isCollapsed: boolean
    isDayOff: boolean
  }

  type ExerciseSet = {
    muscleGroup: string
    exercise: ExerciseMuscle
    sets: Set[]
    recoveryTime: string
  }

  type Set = {
    reps: number
    weight: number
  }

  type ExerciseMuscle = {
    name: string
    equipment: string
  }

  type MuscleGroups = {
    muscle: string
    exercises: ExerciseMuscle[]
  }

  type History = HistoryDate[]

  type HistoryDate = { timestamp: number, exercises: ExerciseSet[] }

  type User = {
    _id: string
    email: string
    password: string
    jwt?: string
    firstName?: string
    lastName?: string
    userName?: string
    dob?: string
    height?: number
    trainingYears?: number
  }
}
