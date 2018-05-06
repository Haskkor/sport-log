import {Item} from '../core/types'

export const createExerciseSet = (done: boolean, exercise: ServerEntity.ExerciseMuscle, recoveryTime: string,
                                  sets: ServerEntity.Set[], muscleGroup: string): ServerEntity.ExerciseSet => {
  return {
    done: done,
    exercise: exercise,
    recoveryTime: recoveryTime,
    sets: sets,
    muscleGroup: muscleGroup
  }
}

export const createItem = (name: string, details: string, content: string, timestamp: string, exerciseSet: ServerEntity.ExerciseSet,
              idHistoryDate?: string): Item => {
  return {
    _idHistoryDate: idHistoryDate,
    name: name,
    details: details,
    content: content,
    timestamp: timestamp,
    exerciseSet: exerciseSet
  }
}

export const createHistoryDate = (timestamp: string, exercises: ServerEntity.ExerciseSet[], id?: string): ServerEntity.HistoryDate => {
  return {
    _id: id,
    timestamp: +timestamp,
    exercises: exercises
  }
}