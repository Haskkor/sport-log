export type Set = {
  reps: number,
  weight: number
}

export type ExerciseSet = {
  muscleGroup: string
  exercise: ExerciseMuscle
  sets: Set[]
  recoveryTime: string
}
export type MuscleGroups = {
  muscle: string,
  exercises: ExerciseMuscle[]
}

export type ExerciseMuscle = {
  name: string,
  equipment: string
}

export type ExercisesDay = {
  day: string,
  exercises: ExerciseSet[],
  isCollapsed: boolean
}

export type Program = {
  active: boolean,
  days: ExercisesDay[]
}

export type Items = {
  [key: string]: Item[]
}

export type Item = {
  name: string,
  details: string,
  content: string,
  timestamp: string
  exerciseSet: ServerEntity.ExerciseSet
  _idHistoryDate?: string
}

export type DayCalendar = {
  dateString: string
  day: number
  month: number
  timestamp: number
  year: number
}