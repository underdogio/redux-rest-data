import { ItemId } from ".";

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

export const requestType = 'request'
export const addItemType = 'add_item'
export const addItemsType = 'add_items'
export const updateItemType = 'update_item'
export const removeItemType = 'remove_item'

interface BaseAction {
  type: typeof baseActionType
  subtype: string
}

export interface AddItemAction extends BaseAction {
  subtype: typeof addItemType
  id: ItemId
  data: any
  meta: any
}

export interface AddItemsAction extends BaseAction {
  subtype: typeof addItemsType
  data: any[]
}

export interface UpdateItemAction extends BaseAction {
  subtype: typeof updateItemType
  id: ItemId
  data: any
  meta: any
}

export interface RemoveItemAction extends BaseAction {
  subtype: typeof removeItemType
  id: ItemId
}

export interface RequestAction extends BaseAction {
  subtype: typeof requestType
  id?: ItemId
  method: 'get' | 'put' | 'delete'
  status: 'started' | 'success' | 'failure'
  data?: any
  error?: any
}

/**
 * The types of actions that a data store can receive.
 */
export type DataStoreAction = AddItemAction | AddItemsAction | UpdateItemAction | RemoveItemAction | RequestAction
