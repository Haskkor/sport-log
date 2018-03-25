declare namespace ServerEntity {
  type Set = {
    reps: number
    weight: number
  }

  type ExerciseSet = {
    muscleGroup: string
    exercise: ExerciseMuscle
    sets: Set[]
    recoveryTime: string
  }

  type MuscleGroups = {
    muscle: string
    exercises: ExerciseMuscle[]
  }

  type ExerciseMuscle = {
    name: string
    equipment: string
  }

  type ExercisesDay = {
    day: string
    exercises: ExerciseSet[]
    isCollapsed: boolean
    isDayOff: boolean
  }

  type Program = {
    name: string
    active: boolean
    days: ExercisesDay[]
  }

  type History = { [key: number]: ExerciseSet[] }
}
