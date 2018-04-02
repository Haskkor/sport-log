export const createOmitTypenameLink = (object: any) => {
  return JSON.parse(JSON.stringify(object), omitTypename)
}

const omitTypename = (key: any, value: any) => {
  return key === '__typename' ? undefined : value
}