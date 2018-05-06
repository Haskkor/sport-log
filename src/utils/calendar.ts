export const createDetailsString = (equipment: string, recovery: string): string => {
  return `${equipment} - Recovery time: ${recovery}`
}

export const createNameString = (name: string, group: string): string => {
  return `${name} - ${group}`
}

export const createContentString = (sets: ServerEntity.Set[]): string => {
  return `Sets:${sets.map((s: ServerEntity.Set) => {
    return ` ${s.reps} x ${s.weight}`
  })}`
}
