// The action type for all actions that this library should care about.
export const baseActionType = '@underdog/redux-rest-data'

/**
 * Generates an action object that has the expected base action type.
 */
const generateActionObject = (type: string, payload: Object) => {
  return {
    ...payload,
    type: baseActionType,
    subtype: type,
  }
}
